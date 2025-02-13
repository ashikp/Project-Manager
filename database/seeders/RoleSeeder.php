<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
class RoleSeeder extends Seeder
{
    public function run()
    {
        Role::create(['name' => 'admin', 'guard_name' => 'web']);
        Role::create(['name' => 'client', 'guard_name' => 'web']);
        Role::create(['name' => 'client_team', 'guard_name' => 'web']);
        Role::create(['name' => 'associate', 'guard_name' => 'web']);
        
        // Create Admin Permission
        Permission::create(['name' => 'admin.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'admin.create', 'guard_name' => 'web']);
        Permission::create(['name' => 'admin.edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'admin.delete', 'guard_name' => 'web']);

        $this->assignPermissionToAdminRole();
    }

    public function assignPermissionToAdminRole(){
        $role = Role::findByName('admin');
        $role->givePermissionTo('admin.*');
    }


}

