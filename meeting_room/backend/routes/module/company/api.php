<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('v1/company/follow',$namespace.'\Module\Company\CompanyController@followInCompanyId');
Route::post('v1/company/user-have-followed',$namespace.'\Module\Company\CompanyController@userHaveFollowedCompany');
