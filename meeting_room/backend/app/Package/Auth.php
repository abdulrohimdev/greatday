<?php
namespace App\Package;
use App\Models\Module\User\UserModel;

class Auth{
    static public function isUser($uuid){
        if(UserModel::where(['uuid' => $uuid])->count() > 0){
            return true;
        }
        return false;
    }

}
