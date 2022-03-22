<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('v1/user/account/list',$namespace."\Module\User\UserController@getAccount");
