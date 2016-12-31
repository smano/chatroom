<?php 
try{
	$db = new PDO("mysql:host=localhost;dbname=chatroom","chatroom","chatroom");
} catch(PDOException $e){
    echo $e->getMessage();
}

$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if(isset($_POST['method'])){
    	$method = $_POST['method'];
    	switch($method){
    		case 'update':
    			update($_POST['name'],$_POST['msg'],$db);
    			break;
    		case 'retrieve':
    			retrieve($db);
    			break;
    		default:
    			echo json_encode(['status'=>'error','text'=>'Invalid request!']);
    	}
    }
}

function update($name,$msg,$db){
	$time = time();
	$insert = $db->prepare("INSERT INTO messages(name, message, created_at)
	    VALUES(:name, :message, :createdat)");
	$insert->execute(array(
	    "name" => $name,
	    "message" => $msg,
	    "createdat" => $time
	));
	if($insert){
		echo json_encode(['status'=>'success']);
	} else{
		echo json_encode(['status'=>'error']);
	}
}


function retrieve($db){
	$sql = $db->query('SELECT * FROM messages')->fetchAll();
	echo json_encode($sql, JSON_PRETTY_PRINT);
}

?>