<?php

namespace App\Models\Module\Room;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookRoomModel extends Model
{
    use HasFactory;
    protected $table="booking_rooms";
    protected $fillable=[
        'roomBookedId',
        'roomId',
        'date',
        'fromTime',
        'toTime',
        'userUuid',
        'description'
    ];
}
