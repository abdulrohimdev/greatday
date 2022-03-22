<?php

namespace App\Http\Controllers\Module\Room;

use App\Http\Controllers\Controller;
use App\Models\Module\Company\CompanyModel;
use App\Models\Module\Company\UserHaveCompanyModel;
use App\Models\Module\Room\BookRoomModel;
use App\Models\Module\Room\RoomModel;
use App\Models\Module\User\UserInRoomModel;
use App\Package\Auth;
use Carbon\Carbon;
use Facade\FlareClient\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class RoomController extends Controller
{
    public function __construct(Request $r)
    {
        if (!Auth::isUser($r->header('uuid'))) {
            return Response()->json(['status' => false, 'message' => "You don't have access!"]);
        }
    }

    public function createWithCompany(Request $r)
    {
        $room = $r->input('room');
        $company = $r->input('company');
        $companyId = explode("-", Str::uuid());
        $createCompany = CompanyModel::create([
            'companyId' => $companyId[0],
            'creatorUserUuid' => $r->header('uuid'),
            'companyName' => $company
        ]);

        if ($createCompany) {
            $getCompany =  $createCompany->first();
            $createRooms = RoomModel::create([
                'roomId' => Str::uuid(),
                'companyId' => $getCompany->companyId,
                'headCount' => $room['headCount'],
                'photoUrl'  => $room['photoUrl'],
                'roomName'  => $room['roomName'],
                'description' => $room['description']
            ]);

            $data = [
                'userUuid' => $r->header('uuid'),
                'companyId' => $getCompany->companyId
            ];

            if (UserHaveCompanyModel::where($data)->count() < 1) {
                UserHaveCompanyModel::create($data);
            }

            if ($createRooms) {
                return Response()->json(['status' => true, 'message' => 'Create room Successfully']);
            }
            return Response()->json(['status' => false, 'message' => 'Create room failed']);
        }
        return Response()->json(['status' => false, 'message' => 'Create room failed']);
    }

    public function getRoomList(Request $r)
    {
        $uuid = $r->header('uuid');
        $date = date('Y-m-d', strtotime($r->input('date')));
        $from = date('H:i:s', strtotime($r->input('from')));
        $to = date('H:i:s', strtotime($r->input('to')));
        $data = DB::select(DB::raw("
        SELECT u.userUuid,c.companyName,r.roomId,r.roomName,(
            IF(
                (SELECT COUNT(*) FROM booking_rooms WHERE booking_rooms.roomId=r.roomId AND date_format(booking_rooms.date,'%Y-%m-%d')='$date'
                AND (TIMEDIFF('$from',booking_rooms.toTime) < 0) ) > 0, '[NOT AVAILABLE]','[AVAILABLE]')
            ) AS isAvailable FROM user_have_companies u
        JOIN companies c ON c.companyId=u.companyId
        JOIN rooms r ON r.companyId=c.companyId
        WHERE u.userUuid='$uuid'
        "));

        return Response()->json(['data' => $data]);
    }

    function roomIsAvailable($data = [])
    {
        $time = Carbon::parse($data['fromTime'])->toTimeString();
        $date = Carbon::parse($data['date'])->format('Y-m-d');
        $record = BookRoomModel::where('roomId', '=', $data['roomId'])
            ->whereDate('date', $date)
            ->whereTime('toTime', '>', $time);
        return $record->count();
    }

    public function createBookRoom(Request $r)
    {
        $room = $r->input('room');
        $account = $r->input('account');

        $room['roomBookedId'] = Str::uuid();
        $room['userUuid'] = $r->header('uuid');
        $check = $this->roomIsAvailable([
            'roomId' => $room['roomId'],
            'date' => $room['date'],
            'fromTime' => $room['fromTime']
        ]);
        $checkTime = (strtotime($room['toTime']) - strtotime(($room['fromTime'])));
        if ($checkTime > 0) {
            if ($check < 1) {
                $createBookRoom = BookRoomModel::create($room);
                if ($createBookRoom) {
                    $userInRoom = [];
                    array_push($userInRoom, [
                        'roomBookedId' => $room['roomBookedId'],
                        'userUuid' => $r->header('uuid'),
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                    foreach ($account as $item) {
                        array_push($userInRoom, [
                            'roomBookedId' =>  $room['roomBookedId'],
                            'userUuid' => $item['uuid'],
                            'created_at' => Carbon::now(),
                            'updated_at' => Carbon::now(),
                        ]);
                    }
                    $storeUserInRoom = UserInRoomModel::insert($userInRoom);
                    if ($storeUserInRoom) {
                        return Response()->json([
                            'status' => true,
                            'message' => 'Room successfully booked'
                        ]);
                    }
                    return Response()->json([
                        'status' => false,
                        'data' => $userInRoom,
                        'message' => 'The room failed to book'
                    ]);
                }
                return Response()->json([
                    'status' => false,
                    'message' => 'The room failed to book',
                ]);
            }
            return Response()->json([
                'status' => false,
                'message' => 'Please double check your time or date, rooms are currently unavailable for that time and date!',
            ]);
        }
        return Response()->json([
            'status' => false,
            'message' => 'Please check your time!',
        ]);
    }
}
