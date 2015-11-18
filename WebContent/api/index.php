<?php

require 'db.php';
require 'Slim/Slim.php';
require '../lib/fpdf/fpdf.php';

\Slim\Slim::registerAutoloader();
use Slim\Slim;

$app=new Slim();

$app->get('/usuario/:user/:pass','autenticar'); // Using Post HTTP Method and process getUser function
$app->get('/usuarios','getUsuarios'); // Using Post HTTP Method and process getUser function

$app->get('/habitacionesTipo','getHabitacionesTipo'); // Using Post HTTP Method and process getUser function
// Deprecated function
// $app->get('/habitaciones/:tipo/:nro/:comp','getHabitaciones'); // Using Post HTTP Method and process getUser function
$app->get('/habitacionesMacro/:nro/:fecha_ingreso/:fecha_egreso','getHabitacionesDispMacro'); // Using Post HTTP Method and process getUser function
$app->get('/habitaciones/:nro/:fecha_ingreso/:fecha_egreso','getHabitacionesDisp'); // Using Post HTTP Method and process getUser function
$app->get('/habitacionesCuenta/:cuenta','getHabitacionesCuenta'); // Using Post HTTP Method and process getUser function

$app->get('/habitacionesDisp','getHabDisp'); // Using Post HTTP Method and process getUser function
$app->get('/habitacionesOcu','getHabitacionesOcu'); // Using Post HTTP Method and process getUser function
$app->get('/serviciosCli/:nombre','getServiciosCliente'); // Using Post HTTP Method and process getUser function


$app->get('/estadia','getEstadias');
$app->post('/estadia','confirmarReserva'); //guardar Reserva
$app->post('/estadia/update','updateEstadia'); //guardar Reserva
$app->post('/estadia/checkIn','registrarCheckIn'); //guardar Reserva
$app->post('/estadia/checkOut','registrarCheckOut'); //guardar Reserva
$app->get('/hotel/calculo/:fechaIn/:fechaOut/:cId','calcularDiferenciasDiasyTotal');
$app->get('/noches/:fechaIn/:fechaOut','dias_transcurridos');
$app->post('/reservas','addReservation'); // Using Post HTTP Method and process getUser function
$app->get('/reservas/:criterio','getReservas'); // Obtener todas las reservas para el metodo get
$app->get('/reservas/:idR','getReservaItem');
$app->put('/reservas','addReservaPut'); //guardar Reserva
$app->get('/habitacionesOcupantes/:estadia','getOcupantes'); //guardar Reserva
$app->post('/habitacionesOcupantes','addcupantes'); //guardar Reserva
$app->post('/filesUpload','uploadFiles');

$app->get('/productos','getProductos');
$app->get('/catProductos','getCatProductos');
$app->post('/pedidos','addPedido');
$app->get('/pedidos/:estadia','getPedidos');

$app->get('/factura/:cuenta','getFactura');

$app->run();

function getServiciosCliente($nombre){
  $request=Slim::getInstance()->request();
  $cliente=json_decode($request->getBody());
  $sql="select c.nombre,pr.descripcion,p.cantidad,p.precioU,p.total,p.fecha,h.codigo from cuenta c
left join estadia e on (c.id=e.idReserva)
left join pedido p on (p.idReserva = e.id_estadia)
left join habitacion h on (e.habitacion=h.id)
left join producto pr on (pr.id=p.idProducto)
where c.nombre = :cliente ";
   try{
             $dbCon = getDB();
             $stmt = $dbCon->prepare($sql);
             $stmt->bindParam("cliente",$nombre);
             $stmt->execute();
             $libres = $stmt->fetchAll(PDO::FETCH_OBJ);
             $dbCon=null;
             echo json_encode($libres);
   }
   catch(PDOException $e){
              echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
   }
}

function getHabDisp(){
  $request=Slim::getInstance()->request();
  $ocupante=json_decode($request->getBody());
  $sql="select * from habitacion where id not in (select habitacion from estadia where (estado = 'RESERVA' or ESTADO='CONFIRMADO' or ESTADO='OCUPADO') ) ";
   try{
             $dbCon = getDB();
             $stmt = $dbCon->prepare($sql);
             $stmt->execute();
             $libres = $stmt->fetchAll(PDO::FETCH_OBJ);
             $dbCon=null;
             echo json_encode($libres);
   }
   catch(PDOException $e){
              echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
   }
}

function getHabitacionesOcu(){
  $request=Slim::getInstance()->request();
  $ocupante=json_decode($request->getBody());
  $sql="SELECT distinct (h.id),h.* from habitacion h left join estadia e on (e.habitacion=h.id) where e.estado<>'DISPONIBLE'";
   try{
             $dbCon = getDB();
             $stmt = $dbCon->prepare($sql);
             $stmt->execute();
             $ocupados = $stmt->fetchAll(PDO::FETCH_OBJ);
             $dbCon=null;
             echo json_encode($ocupados);
   }
   catch(PDOException $e){
              echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
   }
}

function getFactura($cuenta){

  $request = Slim::getInstance()->request();
  $form = json_decode($request->getBody()); // decodificamos los parametros del request
  $sql_query = "SELECT * FROM cuenta where id=:cuentaid";
   try {
     $dbCon = getDB();
     $stmt = $dbCon->prepare($sql_query);
     $stmt->bindParam("cuentaid",$cuenta);
     $stmt->execute();
     $tiposHab = $stmt->fetch(PDO::FETCH_OBJ);
     $dbCon=null;
     $pdf = new FPDF();
     $pdf->AddPage();
     $pdf->SetFont('Arial','B',15);
     $pdf->Cell(0,10,'FACTURA HOSTAL ',1,1);
     $pdf->SetFont('Times','B',12);
     $pdf->Cell(0,10,'NIT : 2198018122' ,0,1);
     $pdf->Cell(0,10,"NOMBRE : ".$tiposHab->nombre ,0,1);
     $pdf->Cell(0,10,"FECHA INGRESO : ".$tiposHab->fecha_ingreso,0,1);
     $pdf->Cell(0,10,"FECHA SALIDA : ".$tiposHab->fecha_salida,0,1);
     $pdf->Cell(0,10,"NOCHES : ".$tiposHab->noches,0,1);
     $pdf->Cell(0,10,"COSTO ESTADIA : ".$tiposHab->costo_estadia,0,1);
     $pdf->Cell(0,10,"COSTO SERVICIOS :".$tiposHab->costo_serviciosExtra,0,1);
     $pdf->Cell(0,10,"TOTAL CANCELADO: ".$tiposHab->total_pagado,0,1);
     $pdf->Output();
ob_end_flush();
     $file = $pdf->Output();
     $filename = 'filename.pdf';
     header('Content-type: application/pdf');
     header('Content-Disposition: inline; filename="' . $filename . '"');
     header('Content-Transfer-Encoding: binary');
     header('Accept-Ranges: bytes');
     @readfile($file);
   }
   catch(PDOException $e) {
       echo '{"error inesperado":{"text":'. $e->getMessage() .'}}';
   }

}

function uploadFiles(){
var_dump($request->getParsedBody());
  if (!isset($_FILES["files"]["name"])) {
        echo "No files uploaded!!";
        return;
    }
    else {
      echo "file found!";
    }
    $imgs = array();
    $files = $_POST['file'];
    echo $files;


}

function addPedido(){
  $request=Slim::getInstance()->request();
  $pedido=json_decode($request->getBody());
  $fecha=date("Y/m/d");
  $sql_query="INSERT INTO PEDIDO(idReserva,idProducto,cantidad,fecha,precioU,total) VALUES(:idReserva,:idProducto,:cantidad,:fecha,:precioU,:total)";
  try{
    $suma=0;
    $dbCon = getDB();
    $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("idReserva",$pedido->idHabitacion);
      $stmt->bindParam("idProducto",$pedido->id);
      $stmt->bindParam("cantidad",$pedido->cantidad);
      $stmt->bindParam("fecha",$fecha);
      $stmt->bindParam("precioU",$pedido->precio);
      $total=($pedido->cantidad * $pedido->precio);
      $stmt->bindParam("total",$total);
      $stmt->execute();
      $lastId = $dbCon->lastInsertId();

         $sql_query1="select * from estadia where id_estadia=:id_estadia";
         $stmt = $dbCon->prepare($sql_query1);
         $stmt->bindParam("id_estadia",$pedido->idHabitacion);
         $stmt->execute();
         $estadia = $stmt->fetch(PDO::FETCH_OBJ);
         $sql_query2 = "select * from estadia where idReserva=:cuentaId";
         $stmt = $dbCon->prepare($sql_query2);
         $stmt->bindParam("cuentaId",$estadia->idReserva);
         $stmt->execute();
         $habitaciones = $stmt->fetchAll(PDO::FETCH_OBJ);
         foreach($habitaciones as $item){
           $sql_qu="select sum(total) as total from pedido where idReserva=:habitacion group by idReserva";
           $stmt = $dbCon->prepare($sql_qu);
           $stmt->bindParam("habitacion",$item->id_estadia);
           $stmt->execute();
           $total = $stmt->fetch(PDO::FETCH_NUM);
           $summ = $total[0];
           $suma = $suma + $summ;
         }

         $sql_queryU= "UPDATE cuenta set costo_serviciosExtra=:serviciosTotal where id=:cuentaId";
         $stmt = $dbCon->prepare($sql_queryU);
         $stmt->bindParam("serviciosTotal",$suma);
         $stmt->bindParam("cuentaId",$estadia->idReserva);
         $stmt->execute();
         $dbCon=null;
   }
  catch(PDOException $e){
     echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
  }
}

function getPedidos($estadia){
  $request=Slim::getInstance()->request();
  $ocupante=json_decode($request->getBody());
  $sql="SELECT  p.descripcion,pe.cantidad,pe.fecha,pe.precioU,pe.total FROM pedido pe left join producto p on (pe.idProducto=p.id) where idReserva=:idEstadia ";
   try{
             $dbCon = getDB();
             $stmt = $dbCon->prepare($sql);
             $stmt->bindParam("idEstadia",$estadia);
             $stmt->execute();
             $productos = $stmt->fetchAll(PDO::FETCH_OBJ);
             $dbCon=null;
             echo json_encode($productos);
   }
   catch(PDOException $e){
              echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
   }
}

function getProductos(){
  $request=Slim::getInstance()->request();
  $ocupante=json_decode($request->getBody());
  $sql="SELECT  * FROM producto ";
   try{
             $dbCon = getDB();
             $stmt = $dbCon->prepare($sql);
             $stmt->execute();
             $productos = $stmt->fetchAll(PDO::FETCH_OBJ);
             $dbCon=null;
             echo json_encode($productos);
   }
   catch(PDOException $e){
              echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
   }
}

function getCatProductos(){
  $request=Slim::getInstance()->request();
  $ocupante=json_decode($request->getBody());
  $sql="SELECT  distinct(tipo) from producto ";
   try{
             $dbCon = getDB();
             $stmt = $dbCon->prepare($sql);
             $stmt->execute();
             $productos = $stmt->fetchAll(PDO::FETCH_OBJ);
             $dbCon=null;
             echo json_encode($productos);
   }
   catch(PDOException $e){
              echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
   }
}

function getOcupantes($estadia){
  $request=Slim::getInstance()->request();
  $ocupante=json_decode($request->getBody());
  $sql="SELECT  * FROM ocupantes where id_estadia=:id_estadia and estado =1 ";

   try{
             $dbCon = getDB();
             $stmt = $dbCon->prepare($sql);
             $stmt->bindParam("id_estadia",$estadia);
             $stmt->execute();
             $ocupantes = $stmt->fetchAll(PDO::FETCH_OBJ);
             $dbCon=null;
             echo json_encode($ocupantes);
   }
   catch(PDOException $e){
              echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
   }
}

function addcupantes(){
  $request=Slim::getInstance()->request();
  $ocupante=json_decode($request->getBody());
  $fecha=date("Y/m/d");
  $sql="INSERT INTO ocupantes(nombre,apellido,estado,fecha_registro,id_estadia,doc_identidad)
       VALUES (:nombre,:apellido,'true',:fecha_registro,:id_estadia,:doc_identidad)";
   try{

             $dbCon = getDB();
             $stmt = $dbCon->prepare($sql);
             if(isset($ocupante->ocupante1N) && ($ocupante->ocupante1N!=""))
             {
               $stmt->bindParam("nombre",$ocupante->ocupante1N);
               $stmt->bindParam("apellido",$ocupante->ocupante1A);
               $stmt->bindParam("fecha_registro",$fecha);
               $stmt->bindParam("id_estadia",$ocupante->idEstadia);
               $stmt->bindParam("doc_identidad",$ocupante->ocupante1D);
               $stmt->execute();
               $lastId = $dbCon->lastInsertId();
             }
             if(isset($ocupante->ocupante2N) && ($ocupante->ocupante2N!=""))
             {
               $stmt->bindParam("nombre",$ocupante->ocupante2N);
               $stmt->bindParam("apellido",$ocupante->ocupante2A);
               $stmt->bindParam("fecha_registro",$fecha);
               $stmt->bindParam("id_estadia",$ocupante->idEstadia);
               $stmt->bindParam("doc_identidad",$ocupante->ocupante2D);
               $stmt->execute();
               $lastId = $dbCon->lastInsertId();
             }
             if(isset($ocupante->ocupante3N) && ($ocupante->ocupante3N!=""))
             {
               $stmt->bindParam("nombre",$ocupante->ocupante3N);
               $stmt->bindParam("apellido",$ocupante->ocupante3A);
               $stmt->bindParam("fecha_registro",$fecha);
               $stmt->bindParam("id_estadia",$ocupante->idEstadia);
               $stmt->bindParam("doc_identidad",$ocupante->ocupante3D);
               $stmt->execute();
               $lastId = $dbCon->lastInsertId();
             }
             if(isset($ocupante->ocupante4N) && ($ocupante->ocupante4N!=""))
             {
               $stmt->bindParam("nombre",$ocupante->ocupante4N);
               $stmt->bindParam("apellido",$ocupante->ocupante4A);
               $stmt->bindParam("fecha_registro",$fecha);
               $stmt->bindParam("id_estadia",$ocupante->idEstadia);
               $stmt->bindParam("doc_identidad",$ocupante->ocupante4D);
               $stmt->execute();
               $lastId = $dbCon->lastInsertId();
             }
             if(isset($ocupante->ocupante5N) && ($ocupante->ocupante5N!=""))
             {
               $stmt->bindParam("nombre",$ocupante->ocupante5N);
               $stmt->bindParam("apellido",$ocupante->ocupante5A);
               $stmt->bindParam("fecha_registro",$fecha);
               $stmt->bindParam("id_estadia",$ocupante->idEstadia);
               $stmt->bindParam("doc_identidad",$ocupante->ocupante5D);
               $stmt->execute();
               $lastId = $dbCon->lastInsertId();
             }

   }
   catch(PDOException $e){
              echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
   }
}

function addReservaPut(){
   $request = Slim::getInstance()->request();
    $form = json_decode($request->getBody());
    echo "done!".$form[0]->codigo;
}
/*Obtiene usuario */
function autenticar($user,$pass) {
   $request = Slim::getInstance()->request();

   $sql_query = "SELECT id,usuario FROM usuario u where u.nombre=:nombre and u.clave=:clave";
    try {
      $dbCon = getDB();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->execute(array(':nombre'=>$user,
                           ':clave'=>$pass
                          ));
     $fetch = $stmt->fetch(PDO::FETCH_ASSOC);

     // if not empty result
    if (is_array($fetch))  {
    // $_SESSION["userMember"] = $fetch["username"];
    // $_SESSION["password"] = $fetch["password"];
       echo json_encode($fetch);
     }else {
       echo "null";
     }

    }
    catch(PDOException $e) {
        echo '{"error inesperado":{"text":'. $e->getMessage() .'}}';
    }
}

/*Obtiene todas las habitaciones disponibles */
function getHabitacionesDispMacro($nro,$fecha_ingreso,$fecha_egreso){
   $request = Slim::getInstance()->request();
   if($nro<=0) $nro=1000;
   $sql_query = "SELECT count(a.tipo) total1,a.tipo,count(a.clase) total2,a.clase
                from
                (SELECT h.*,nr_simples + nro_matrimniales as camas,t.descripcion as Clase
                 FROM habitacion h left join clase_habitacion t on (h.tipo_habitacion=t.id)
                 where h.id not in (select habitacion from estadia where fecha_ingreso BETWEEN CAST(:fecha_ingresoP AS DATE) AND CAST(:fecha_egresoP AS DATE) and fecha_egreso BETWEEN CAST(:fecha_ingresoP AS DATE) AND CAST(:fecha_egresoP AS DATE) )
                 group by id having camas >=:numero_camas) a
                  group by a.tipo,a.clase";
    try {
      $dbCon = getDB();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("fecha_ingresoP",$fecha_ingreso);
      $stmt->bindParam("fecha_egresoP",$fecha_egreso);
      $stmt->bindParam("numero_camas",$nro);
      $stmt->execute();
      $habitaciones = $stmt->fetchAll(PDO::FETCH_OBJ);
      $dbCon=null;
      echo json_encode($habitaciones);
    }
    catch(PDOException $e) {
        echo '{"error inesperado":{"text":'. $e->getMessage() .'}}';
    }
}
/*Obtiene todas las habitaciones disponibles */
function getHabitacionesDisp($nro,$fecha_ingreso,$fecha_egreso){
   $request = Slim::getInstance()->request();
   if($nro<=0) $nro=1000;
   $sql_query = "SELECT h.*,nr_simples + nro_matrimniales as camas,t.descripcion as Clase
                 FROM habitacion h left join clase_habitacion t on (h.tipo_habitacion=t.id)
                 where h.id not in (select habitacion from estadia where fecha_ingreso BETWEEN CAST(:fecha_ingresoP AS DATE) AND CAST(:fecha_egresoP AS DATE) and fecha_egreso BETWEEN CAST(:fecha_ingresoP AS DATE) AND CAST(:fecha_egresoP AS DATE) and (estado = 'RESERVA' or ESTADO='CONFIRMADO' or ESTADO='OCUPADO'))
                 group by id having camas >=:numero_camas order by camas asc ";
    try {
      $dbCon = getDB();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("fecha_ingresoP",$fecha_ingreso);
      $stmt->bindParam("fecha_egresoP",$fecha_egreso);
      $stmt->bindParam("numero_camas",$nro);
      $stmt->execute();
      $habitaciones = $stmt->fetchAll(PDO::FETCH_OBJ);
      $dbCon=null;
      echo json_encode($habitaciones);
    }
    catch(PDOException $e) {
        echo '{"error inesperado":{"text":'. $e->getMessage() .'}}';
    }
}
/*Obtiene todas las habitaciones disponibles */
function getHabitacionesCuenta($cuenta){
   $request = Slim::getInstance()->request();
   $sql_query = "SELECT h.*,e.*,t.descripcion as Clase
                 FROM habitacion h left join clase_habitacion t on (h.tipo_habitacion=t.id)
                 left join estadia e on (e.habitacion=h.id)
                 left join cuenta c on (c.id=e.idReserva)
                 where c.id = :cuentaId";
    try {
      $dbCon = getDB();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("cuentaId",$cuenta);
      $stmt->execute();
      $habitaciones = $stmt->fetchAll(PDO::FETCH_OBJ);
      $dbCon=null;
      echo json_encode($habitaciones);
    }
    catch(PDOException $e) {
        echo '{"error inesperado":{"text":'. $e->getMessage() .'}}';
    }
}
/*Obtiene los tipos de habitaciones disponibles */
/* Deprecated function
function getHabitaciones($tipo,$nro,$comp){
   $request = Slim::getInstance()->request();
   if($comp=='true') $bano="COMPARTIDO";
   else $bano="PRIVADO";
   $sql_query = "SELECT h.*,nr_simples + nro_matrimniales as camas,t.descripcion as Tipo FROM habitacion h left join tipo_habitacion t on (h.tipo_habitacion=t.id) where tipo_habitacion=:tipo and
                  tipo_banio=:banio group by id having camas >=:numero_camas order by camas asc ";
    try {
      $dbCon = getDB();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("tipo",$tipo);
      $stmt->bindParam("numero_camas",$nro);
      $stmt->bindParam("banio",$bano);
      $stmt->execute();
      $tiposHab = $stmt->fetchAll(PDO::FETCH_OBJ);
      $dbCon=null;
      echo json_encode($tiposHab);
    }
    catch(PDOException $e) {
        echo '{"error inesperado":{"text":'. $e->getMessage() .'}}';
    }
}
*/
/*Obtiene los tipos de habitaciones disponibles */
function getHabitacionesTipo() {
   $request = Slim::getInstance()->request();
	 $form = json_decode($request->getBody()); // decodificamos los parametros del request
   $sql_query = "SELECT id,descripcion FROM tipo_habitacion t";
    try {
      $dbCon = getDB();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->execute();
      $tiposHab = $stmt->fetchAll(PDO::FETCH_OBJ);
      $dbCon=null;
      echo json_encode($tiposHab);
    }
    catch(PDOException $e) {
        echo '{"error inesperado":{"text":'. $e->getMessage() .'}}';
    }
}

/*obtiene los usuarios  */
function getUsuarios(){
  $request=Slim::getInstance()->request();
  $form=json_decode($request->getBody());
  $sql_query="SELECT id,usuario from usuario u";
  try{
    $dbCon = getDB();
    $stmt = $dbCon->prepare($sql_query);
    $stmt->execute();
    $usuarios = $stmt->fetchAll(PDO::FETCH_OBJ);
    $dbCon=null;
    echo json_encode($usuarios);
  }
  catch(PDOException $e){
     echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
  }
}

/* agrega una reservacion*/
function addReservation(){
 $request=Slim::getInstance()->request();
 $reserva=json_decode($request->getBody());
 $fecha=date("Y/m/d");
 $sql="INSERT INTO cuenta(`tpo_contacto`,fecha_llegada,`fecha_ingreso`,`fecha_salida`,`noches`,`numero_tarjeta`,`exp_date`,`firstname_tarjeta`,`lastname_tarjeta`,
      `codigo`,`servicio_recojo`,`aerolinea`,`vuelo`,`hora`,desde,observacion,responsable,nombre,email,telefono,fecha_reserva,numero_personas,estado,pago_tarjeta)
      VALUES (:tpo_contacto,:fecha_llegada,:fecha_ingreso,:fecha_salida,:noches,:numero_tarjeta,:exp_date,:firstname_tarjeta,:lastname_tarjeta,
          :codigo,:servicio_recojo,:aerolinea,:vuelo,:hora,:desde,:observacion,:responsable,:nombre,:email,:telefono,:fecha_reserva,:numero_personas,'RESERVA',:pago_tarjeta)";
  try{
            $dbCon = getDB();
            $stmt = $dbCon->prepare($sql);
            $stmt->bindParam("tpo_contacto",$reserva->tipoContacto);
            $stmt->bindParam("fecha_llegada",$reserva->dateIn);
            $stmt->bindParam("fecha_ingreso",$reserva->datea);
            $stmt->bindParam("fecha_salida",$reserva->dateOut);
            $stmt->bindParam("noches",$reserva->nights);
            $stmt->bindParam("numero_tarjeta",$reserva->card);
            $stmt->bindParam("exp_date",$reserva->expDate);
            $stmt->bindParam("firstname_tarjeta",$reserva->cardName);
            $stmt->bindParam("lastname_tarjeta",$reserva->cardLastName);
            $stmt->bindParam("codigo",$reserva->code);
            $stmt->bindParam("servicio_recojo",$reserva->pick);
            $stmt->bindParam("aerolinea",$reserva->airline);
            $stmt->bindParam("vuelo",$reserva->flight);
            $stmt->bindParam("hora",$reserva->time);
            $stmt->bindParam("desde",$reserva->from);
            $stmt->bindParam("observacion",$reserva->observation);
            $stmt->bindParam("responsable",$reserva->responsable);
            $stmt->bindParam("nombre",$reserva->name);
            $stmt->bindParam("email",$reserva->email);
            $stmt->bindParam("telefono",$reserva->phone);
            $stmt->bindParam("pago_tarjeta",$reserva->cardPick);
            $stmt->bindParam("numero_personas",$reserva->numero);
            $stmt->bindParam("fecha_reserva",$fecha);
            $stmt->execute();
            $lastId = $dbCon->lastInsertId();

            foreach($reserva->selectedHabs as $value)
            {
                $sql_estadia="INSERT INTO estadia(habitacion,estado,fecha_ingreso,con_reserva,idReserva,fecha_egreso,fecha_registro)
                            VALUES(:habitacion,'RESERVA',:fecha_ingreso,'true',:idReserva,:fecha_egreso,:fecha_registro)";
                $stmt = $dbCon->prepare($sql_estadia);
                $stmt->bindParam("habitacion",$value->id);
                $stmt->bindParam("fecha_ingreso",$reserva->dateIn);
                $stmt->bindParam("idReserva",$lastId);
                $stmt->bindParam("fecha_egreso",$reserva->dateOut);
                $stmt->bindParam("fecha_registro",$fecha);
                $stmt->execute();
            }
            $dbCon=null;
            echo json_encode($lastId);
  }
  catch(PDOException $e){
             echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
  }
}


function confirmarReserva(){
  $request=Slim::getInstance()->request();
  $reserva=json_decode($request->getBody());
  $sql_query="UPDATE CUENTA SET estado='CONFIRMADO' where id=:cuentaId";
  try{
      $dbCon = getDB();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("cuentaId",$reserva->id);
      $stmt->execute();
      $sql_query="UPDATE estadia set estado='CONFIRMADO' where idReserva=:cuentaId ";
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("cuentaId",$reserva->id);
      $stmt->execute();
      $dbCon=null;
      echo "success reservas";
     }
  catch(PDOException $e){
     echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
  }
}

function updateEstadia(){
  $request=Slim::getInstance()->request();
  $reserva=json_decode($request->getBody());
  $sql_query="UPDATE CUENTA SET fecha_ingreso =:fecha_ingreso,
  fecha_salida=:fecha_salida,
  noches=:noches,
  numero_tarjeta=:numero_tarjeta,
              exp_date=:expDate,
              firstname_tarjeta=:firstname_tarjeta,
              lastname_tarjeta=:lastname_tarjeta,
              codigo=:codigo,
              numero_personas=:numero_personas,
              pago_tarjeta=:pago_tarjeta,
              nombre=:nombre,
              email=:email,
              telefono=:telefono,costo_estadia=:costo_estadia where id=:cuentaId";
  $costo_estadia=calcularCostoEstadia($reserva->fecha_ingreso,$reserva->fecha_salida,$reserva->id);
  try{
      $dbCon = getDB();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("fecha_ingreso",$reserva->fecha_ingreso);
      $stmt->bindParam("fecha_salida",$reserva->fecha_salida);
      $stmt->bindParam("noches",$reserva->noches);
      $stmt->bindParam("numero_tarjeta",$reserva->numero_tarjeta);
      $stmt->bindParam("expDate",$reserva->exp_date);
      $stmt->bindParam("firstname_tarjeta",$reserva->firstname_tarjeta);
      $stmt->bindParam("lastname_tarjeta",$reserva->lastname_tarjeta);
      $stmt->bindParam("codigo",$reserva->codigo);
      $stmt->bindParam("numero_personas",$reserva->numero_personas);
      $stmt->bindParam("pago_tarjeta",$reserva->pago_tarjeta);
      $stmt->bindParam("cuentaId",$reserva->id);
      $stmt->bindParam("nombre",$reserva->nombre);
      $stmt->bindParam("email",$reserva->email);
      $stmt->bindParam("telefono",$reserva->telefono);
      $stmt->bindParam("costo_estadia",$costo_estadia);
      $stmt->execute();
      $dbCon=null;
      echo "success update estadia";
     }
  catch(PDOException $e){
     echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
  }
}
/*obtiene los usuarios  */
function getReservas($criterio){
  $request=Slim::getInstance()->request();
  $sql_query="select * from cuenta r where estado=:criterio";
  try{
    $dbCon = getDB();
    $stmt = $dbCon->prepare($sql_query);
    $stmt->bindParam("criterio",$criterio);
    $stmt->execute();
    $reservas = $stmt->fetchAll(PDO::FETCH_OBJ);
    foreach($reservas as $value){
      $value->noches=dias_transcurridos($value->fecha_ingreso,$value->fecha_salida);
    }
    $dbCon=null;
    echo json_encode($reservas);
  }
  catch(PDOException $e){
     echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
  }
}

function getReservaItem($idR){
  $request=Slim::getInstance()->request();
  $sql_query="select r from cuenta r where r.id=:id";
  try{
    $dbCon = getDB();
    $stmt = $dbCon->prepare($sql_query);
    $stmt->bindParam("id",$idR);
    $stmt->execute();
    $reservas = $stmt->fetch(PDO::FETCH_OBJ);
    $dbCon=null;
    echo json_encode($reservas);
  }
  catch(PDOException $e){
     echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
  }
}

/*obtiene los usuarios  */
function getEstadias(){
  $request=Slim::getInstance()->request();
  $sql_query="select * from estadia e";
  try{
    $dbCon = getDB();
    $stmt = $dbCon->prepare($sql_query);
    $stmt->execute();
    $estadias = $stmt->fetchAll(PDO::FETCH_OBJ);
    $dbCon=null;
    echo json_encode($estadias);
  }
  catch(PDOException $e){
     echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
  }
}

function registrarCheckIn(){
  updateEstadia();
  $request=Slim::getInstance()->request();
  $reserva=json_decode($request->getBody());
  $sql_query="INSERT INTO CLIENTE (nombre,telefono,email,procedencia,nacionalidad,doc_identidad,profesion)
      VALUES (:nombre,:telefono,:email,:procedencia,:nacionalidad,:doc_identidad,:profesion)";
  try{
      $dbCon = getDB();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("nombre",$reserva->nombre);
      $stmt->bindParam("telefono",$reserva->telefono);
      $stmt->bindParam("email",$reserva->email);
      $stmt->bindParam("procedencia",$reserva->procedencia);
      $stmt->bindParam("nacionalidad",$reserva->nacionalidad);
      $stmt->bindParam("doc_identidad",$reserva->doc_identidad);
      $stmt->bindParam("profesion",$reserva->profesion);
      $stmt->execute();
      $lastId = $dbCon->lastInsertId();
      $sql_update="UPDATE CUENTA SET estado='OCUPADO', cliente_resp=:cliente where id=:cuentaId";
      $stmt = $dbCon->prepare($sql_update);
      $stmt->bindParam("cliente",$lastId);
      $stmt->bindParam("cuentaId",$reserva->id);
      $stmt->execute();
      $sql_query="UPDATE estadia set estado='OCUPADO' where idReserva=:cuentaId ";
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("cuentaId",$reserva->id);
      $stmt->execute();
      $dbCon=null;
      echo "success insert checkIn";
     }
  catch(PDOException $e){
     echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
  }
}

function registrarCheckOut(){
  updateEstadia();
  $request=Slim::getInstance()->request();
  $reserva=json_decode($request->getBody());
  $sql_update="UPDATE CUENTA SET estado='DISPONIBLE',total_pagado=:pagado where id=:cuentaId";
  try{
      $dbCon = getDB();
      $stmt = $dbCon->prepare($sql_update);
      $stmt->bindParam("pagado",$reserva->pagado);
      $stmt->bindParam("cuentaId",$reserva->id);
      $stmt->execute();
      $sql_update="UPDATE estadia SET estado='DISPONIBLE' where idReserva=:cuentaId";
      $stmt = $dbCon->prepare($sql_update);
      $stmt->bindParam("cuentaId",$reserva->id);
      $stmt->execute();
      $dbCon=null;
      echo "success update checkOut";
     }
  catch(PDOException $e){
     echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
  }
}

function calcularDiferenciasDiasyTotal($fechaIn,$fechaOut,$cId){
  $calculo= new stdClass();
  $calculo->dias=dias_transcurridos($fechaIn,$fechaOut);
  $calculo->costo=calcularCostoEstadia($fechaIn,$fechaOut,$cId);
  echo json_encode($calculo);
}

function dias_transcurridos($fechaIn,$fechaOut)
{
	$dias	= (strtotime($fechaIn)-strtotime($fechaOut))/86400;
	$dias 	= abs($dias); $dias = floor($dias);
  return $dias;
}

function calcularCostoEstadia($fechaIn,$fechaOut,$cuentaId){
  $request = Slim::getInstance()->request();
  $sql_query = "SELECT h.tarifa
                FROM habitacion h left join clase_habitacion t on (h.tipo_habitacion=t.id)
                left join estadia e on (e.habitacion=h.id)
                left join cuenta c on (c.id=e.idReserva)
                where c.id = :cuentaId";
   try {
     $dbCon = getDB();
     $stmt = $dbCon->prepare($sql_query);
     $stmt->bindParam("cuentaId",$cuentaId);
     $stmt->execute();
     $total=0;
     $habitaciones = $stmt->fetchAll(PDO::FETCH_OBJ);
     $dias = dias_transcurridos($fechaIn,$fechaOut);

     foreach($habitaciones as $item){
          $sum=0;
          $sum=$item->tarifa*$dias;
          $total=$sum + $total;
     }
     $dbCon=null;
     return $total;
   }
   catch(PDOException $e){
      echo '{"error inesperado" : {"text":'. $e->getMessage().'}}';
   }
 }

















?>
