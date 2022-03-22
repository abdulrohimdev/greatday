<?php

namespace App\Models\Module\Company;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserHaveCompanyModel extends Model
{
    use HasFactory;

    protected $table = "user_have_companies";
    protected $fillable = [
        'userUuid',
        'companyId'
    ];
}
