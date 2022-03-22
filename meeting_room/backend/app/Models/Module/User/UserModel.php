<?php

namespace App\Models\Module\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserModel extends Model
{
    use HasFactory;
    protected $table='users';
    protected $fillable=[
        'uuid',
        'name',
        'email',
        'password',
        'authToken',
        'accountType'
    ];
}
