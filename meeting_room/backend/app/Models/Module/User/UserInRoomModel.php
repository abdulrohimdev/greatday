<?php

namespace App\Models\Module\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserInRoomModel extends Model
{
    use HasFactory;
    protected $table="user_in_rooms";
    protected $fillable=[
        'roomBookedId',
        'userUuid'
    ];
}
