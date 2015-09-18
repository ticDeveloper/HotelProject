<?php

require 'db.php';
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();
use Slim\Slim;

$app=new Slim();

$app->post('/usuario','autenticar'); // Using Post HTTP Method and process getUser function
$app->run();

/*Obtiene usuario */
function autenticar() {
   $request = Slim::getInstance()->request();
	 $form = json_decode($request->getBody());
   $sql_query = "SELECT id FROM usuario u where u.nombre=:nombre and u.clave=:clave";
    try {
      $dbCon = getDB();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->execute(array(':nombre'=>$form->name,
                           ':clave'=>$form->clave
                          ));
     $fetch = $stmt->fetch(PDO::FETCH_ASSOC);

     // if not empty result
     if (is_array($fetch))  {
    // $_SESSION["userMember"] = $fetch["username"];
    // $_SESSION["password"] = $fetch["password"];
    echo 'success';
    }else {
    echo 'error login';
    }
    }
    catch(PDOException $e) {
        echo '{"error inesperado":{"text":'. $e->getMessage() .'}}';
    }
}

?>
