<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use illuminate\Support\Str;
use App\Models\Module\User\UserModel;
use App\Package\Auth;

class AuthController extends Controller
{

    public function credential(Request $r)
    {
        if ($r->input('accountType') == 'internal') {
            $credential = [
                'email' => $r->input('email'),
                'accountType' => $r->input('accountType'),
            ];
        } else {
            $credential = [
                'email' => $r->input('email'),
                'accountType' => $r->input('accountType'),
            ];
        }

        $data = UserModel::where($credential);
        if ($data->count() > 0) {
            $user = $data->first();
            $pass = $r->input('accountType') == 'internal' ? $r->input('password') : $r->input('authToken');
            if(Hash::check($pass,$user->authToken)){
                return  Response()->json(
                    [
                        'status' => true,
                        'message' => 'Login successfully',
                        'data' => $data->first()
                    ],
                );
            }
            else{
                return  Response()->json(
                    [
                        'status' => false,
                        'message' => 'Login failed',
                    ],
                );
            }
        } else {
            if ($r->input('accountType') == 'external') {
                $create = UserModel::create([
                    'uuid' => Str::uuid(),
                    'email' => $r->input('email'),
                    'name' => $r->input('name'),
                    'authToken' => Hash::make($r->input('authToken')),
                    'accountType' => $r->input('accountType'),
                ]);
                if ($create) {
                    return  Response()->json(
                        [
                            'status' => true,
                            'message' => 'Login successfully',
                            'data' => $create->first()
                        ],
                    );
                }
            } else {
                return  Response()->json(
                    [
                        'status' => false,
                        'message' => 'Login failed'

                    ],
                );
            }
        }
    }

    public function register(Request $r)
    {
        if (UserModel::where([
            'email' => $r->input('email'),
            'accountType' => $r->input('accountType')
        ])->count() > 0) {
            return  Response()->json(
                [
                    'status' => false,
                    'message' => 'Email already exist'
                ],
            );
        } else {
            $create = UserModel::create([
                'uuid' => Str::uuid(),
                'email' => $r->input('email'),
                'name' => $r->input('name'),
                'authToken' => Hash::make($r->input('password')),
            ]);
            if ($create) {
                return  Response()->json(
                    [
                        'status' => true,
                        'message' => 'Register successfully',
                        'data' => $create->first()
                    ],
                );
            }
        }
    }

    public function checkAccount(Request $r){
        $uuid = $r->header('uuid');
        if(Auth::isUser($uuid)){
            return Response()->json(['status' => true]);
        }
        return Response()->json(['status' => false]);
    }

}
