<?php

    $arr = [
        "success" => true,
        "data" => [],
        "message" => ["text" => "Request successfully served.", "class" => "alert-success"],
    ];
    
    if (isset($_POST['sampleForm'])) {
        
         $hasErrors = false;
        
        if(!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
            $hasErrors = true;
            $arr['errors']['email'] = ["The email must be valid."];
        }
        
        if(!filter_var($_POST['age'], FILTER_VALIDATE_INT)) {
            $hasErrors = true;
            $arr['errors']['age'] = ["The age must be valid integer."];
        }
        
        if ($hasErrors) {
            $arr['success'] = false;
        } else {
            
            $arr['data'] = $_POST;
            $arr['body'] = "You have submitted the following data: <br>" . json_encode($_POST, JSON_PRETTY_PRINT);
        }
        
        
    }
    
    if (isset($_POST['dataattributes']) || isset($_POST['action'])) {
         $arr['body'] = "You have submitted the following data: <br>" . json_encode($_POST, JSON_PRETTY_PRINT);
    }
    
    if (isset($_POST['uploadFile'])) {
         $arr['body'] = "You file has been uploaded";
    }
    
    if (isset($_POST['customHandlers'])) {
         ?>
            <h4>Raw HTML</h4>
            <p>You can also fetch raw html with ActionAjax.</p>
            <p><?php echo $_POST['name'] ?>, Thanks for using.</p>
         <?php
    } else {
    
        header("Content-Type: application/json");
        echo json_encode($arr);
    }

