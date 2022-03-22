<?php

namespace App\Http\Controllers\Module\Company;

use App\Http\Controllers\Controller;
use App\Models\Module\Company\CompanyModel;
use App\Models\Module\Company\UserHaveCompanyModel;
use App\Package\Auth;
use Facade\FlareClient\Http\Response;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function __construct(Request $r)
    {
        if (!Auth::isUser($r->header('uuid'))) {
            return Response()->json(['status' => false, 'message' => "You don't have access!"]);
        }
    }

    public function followInCompanyId(Request $r)
    {
        if (CompanyModel::where(['companyId' => $r->input('companyId')])->count() > 0) {
            $data = [
                'userUuid' => $r->header('uuid'),
                'companyId' => $r->input('companyId'),
            ];
            $checkCompany = UserHaveCompanyModel::where($data);
            if ($checkCompany->count() > 0) {
                $companyId = $checkCompany->first();
                $getCompany = CompanyModel::where(['companyId' => $companyId->companyId])->first();
                return Response()->json(['status' => false, 'message' => 'you have joined/followed ' . $getCompany->companyName]);
            }
            $create = UserHaveCompanyModel::create($data);
            if ($create) {
                $company = $create->first();
                $getCompany = CompanyModel::where(['companyId' => $create->companyId])->first();
                return Response()->json(['status' => true,'message' => 'You have successfully joined ' . $getCompany->companyName]);
            }
        } else {
            return Response()->json(['status' => false, 'message' => 'The company you want to join was not found!']);
        }
    }

    public function userHaveFollowedCompany(Request $r){
        if(UserHaveCompanyModel::where(['userUuid' => $r->header('uuid')])->count() > 0){
            return Response()->json(['status' => true]);
        }
        return Response()->json(['status' => false]);
    }
}
