<?php

namespace App\Http\Controllers\Module\User;

use App\Http\Controllers\Controller;
use App\Package\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    //

    public function __construct(Request $r)
    {
        if (!Auth::isUser($r->header('uuid'))) {
            return Response()->json(['status' => false, 'message' => "You don't have access!"]);
        }
    }

    public function getAccount(Request $r)
    {
        $uuid = $r->header('uuid');
        $accountList = DB::select(DB::raw("
        SELECT us.* FROM user_have_companies getAccount
            JOIN users us ON us.uuid=getAccount.userUuid
                WHERE getAccount.companyId IN (
            (SELECT companyId FROM user_have_companies u WHERE u.userUuid='$uuid'))
        "));

         return Response()->json(['data' => $accountList]);
    }
}
