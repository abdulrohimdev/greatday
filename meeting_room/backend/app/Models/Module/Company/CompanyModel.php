<?php

namespace App\Models\Module\Company;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyModel extends Model
{
    use HasFactory;
    protected $table="companies";
    protected $fillable=[
        'companyId',
        'companyName',
        'creatorUserUuid',
    ];

}
