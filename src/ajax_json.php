<?php
// JSON形式でデータを返す。→
if(!empty($_POST)){
	// json_encode関数でJSON形式に変える。
    echo json_encode(array(
    	'date' => $_POST['date'],
    	'time' => $_POST['time'],
    	'people' => $_POST['people'],
    	'name' => $_POST['name'], 
    	'email' =>$_POST['email'],
    ));
}