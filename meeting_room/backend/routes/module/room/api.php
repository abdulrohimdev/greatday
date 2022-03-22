<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('v1/rooms/create',$namespace.'\Module\Room\RoomController@createWithCompany');
Route::post('v1/rooms/data',$namespace.'\Module\Room\RoomController@getRoomList');
Route::post('v1/rooms/booking',$namespace.'\Module\Room\RoomController@createBookRoom');
Route::post('v1/rooms/schedule',$namespace.'\Module\Room\RoomScheduleController@getSchedule');
