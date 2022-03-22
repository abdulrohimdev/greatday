<?php

namespace App\Models\Module\Room;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomModel extends Model
{
    use HasFactory;
    protected $table="rooms";
    protected $fillable=[
        'roomId',
        'companyId',
        'headCount',
        'photoUrl',
        'roomName',
        'description'
    ];
}
