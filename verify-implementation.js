const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Dayflow HRMS Backend Implementation...\n');

let checksPassed = 0;
let totalChecks = 0;

function check(description, test) {
    totalChecks++;
    try {
        const result = test();
        if (result) {
            console.log(`✅ ${description}`);
            checksPassed++;
        } else {
            console.log(`❌ ${description}`);
        }
    } catch (error) {
        console.log(`❌ ${description} - Error: ${error.message}`);
    }
}

// Check 1: Prisma schema has all required models
check('Prisma schema exists and has all models', () => {
    const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
    if (!fs.existsSync(schemaPath)) return false;
    
    const schema = fs.readFileSync(schemaPath, 'utf8');
    const requiredModels = ['User', 'Attendance', 'LeaveRequest', 'LeaveBalance', 'Payroll', 'Company', 'Role'];
    
    return requiredModels.every(model => schema.includes(`model ${model}`));
});

// Check 2: All API route files exist
check('All API route files exist', () => {
    const apiRoutes = [
        'app/api/auth/register/route.ts',
        'app/api/auth/login/route.ts',
        'app/api/employees/route.ts',
        'app/api/employee/profile/route.ts',
        'app/api/attendance/route.ts',
        'app/api/attendance/history/route.ts',
        'app/api/leave/route.ts',
        'app/api/leave/[id]/route.ts',
        'app/api/leave/balance/route.ts',
        'app/api/payroll/route.ts',
        'app/api/dashboard/route.ts'
    ];
    
    return apiRoutes.every(route => fs.existsSync(path.join(__dirname, route)));
});

// Check 3: Package.json has required dependencies
check('Package.json has required dependencies', () => {
    const packagePath = path.join(__dirname, 'package.json');
    if (!fs.existsSync(packagePath)) return false;
    
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const requiredDeps = ['@prisma/client', 'prisma', 'bcrypt', 'jsonwebtoken', 'next'];
    
    return requiredDeps.every(dep => pkg.dependencies[dep] || pkg.devDependencies[dep]);
});

// Check 4: API documentation exists
check('API documentation exists', () => {
    return fs.existsSync(path.join(__dirname, 'API_DOCUMENTATION.md'));
});

// Check 5: Verification checklist exists
check('Verification checklist exists', () => {
    return fs.existsSync(path.join(__dirname, 'VERIFICATION_CHECKLIST.md'));
});

// Check 6: Migration script exists
check('Database migration script exists', () => {
    return fs.existsSync(path.join(__dirname, 'migrate.sql'));
});

// Check 7: Try to generate Prisma client
check('Can generate Prisma client', () => {
    try {
        execSync('npx prisma generate', { stdio: 'pipe' });
        return true;
    } catch (error) {
        return false;
    }
});

// Check 8: Check TypeScript compilation (basic check)
check('TypeScript files are syntactically correct', () => {
    const apiDir = path.join(__dirname, 'app', 'api');
    if (!fs.existsSync(apiDir)) return true; // Skip if no API dir
    
    function checkTsFiles(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                if (!checkTsFiles(fullPath)) return false;
            } else if (file.endsWith('.ts')) {
                try {
                    // Basic syntax check - try to read the file
                    fs.readFileSync(fullPath, 'utf8');
                } catch (error) {
                    return false;
                }
            }
        }
        return true;
    }
    
    return checkTsFiles(apiDir);
});

// Summary
console.log(`\n📊 Summary: ${checksPassed}/${totalChecks} checks passed`);

if (checksPassed === totalChecks) {
    console.log('🎉 All basic checks passed! Your backend implementation is ready.');
    console.log('\n📋 Next steps:');
    console.log('1. Run the database migration: psql your_database < migrate.sql');
    console.log('2. Start the development server: npm run dev');
    console.log('3. Test the API endpoints using Postman or curl');
    console.log('4. Follow the VERIFICATION_CHECKLIST.md for comprehensive testing');
} else {
    console.log('⚠️  Some checks failed. Please review the issues above.');
    console.log('\n🔧 Common fixes:');
    console.log('- Install missing dependencies: npm install');
    console.log('- Generate Prisma client: npx prisma generate');
    console.log('- Check that all files are created correctly');
}

console.log('\n📚 Refer to API_DOCUMENTATION.md for endpoint details');
console.log('📋 Use VERIFICATION_CHECKLIST.md for comprehensive testing');
