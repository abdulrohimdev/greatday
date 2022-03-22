<?php

namespace App\Http\Controllers\Module\Room;

use App\Http\Controllers\Controller;
use App\Package\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoomScheduleController extends Controller
{
    public function __construct(Request $r)
    {
        if (!Auth::isUser($r->header('uuid'))) {
            return Response()->json(['status' => false, 'message' => "You don't have access!"]);
        }
    }

    public function getSchedule(Request $r)
    {
        $uuid = $r->header('uuid');
        $schedule = DB::select(DB::raw("
            SELECT u.userUuid,b.roomBookedId,r.roomId,r.roomName,r.photoUrl,r.description,c.companyName,b.date,b.fromTime,b.toTime FROM user_in_rooms u
            JOIN booking_rooms b ON b.roomBookedId=u.roomBookedId
            JOIN rooms r ON r.roomId=b.roomId
            JOIN companies c ON c.companyId=r.companyId
            WHERE u.userUuid='$uuid' order by b.id desc
        "));

        return Response()->json([
            'data' => $schedule
        ]);
    }
}
