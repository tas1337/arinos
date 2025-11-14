const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Fly.io deployment...\n');

// Check for Fly.io CLI
try {
  execSync('flyctl version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Fly.io CLI not found. Please install it first:');
  console.error('   https://fly.io/docs/getting-started/installing-flyctl/\n');
  console.error('   Or run: curl -L https://fly.io/install.sh | sh\n');
  process.exit(1);
}

// Check if user is logged in
try {
  execSync('flyctl auth whoami', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Not logged in to Fly.io. Please login first:');
  console.error('   Run: flyctl auth login\n');
  process.exit(1);
}

// Check if app exists
let appExists = false;
try {
  const apps = execSync('flyctl apps list --json', { encoding: 'utf-8' });
  const appList = JSON.parse(apps);
  appExists = appList.some(app => app.Name === 'stego-app');
} catch (error) {
  // App doesn't exist yet
}

if (!appExists) {
  console.log('📦 Creating new Fly.io app...');
  try {
    execSync('flyctl apps create stego-app', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to create app.\n');
    process.exit(1);
  }
}

// Build and deploy
console.log('\n🔨 Building and deploying...\n');
try {
  // Deploy from deployment directory, but build context is parent
  const deploymentDir = path.join(__dirname);
  const projectRoot = path.join(__dirname, '..');
  
  // Copy fly.toml to project root and fix dockerfile path
  const fs = require('fs');
  let flyTomlContent = fs.readFileSync(path.join(deploymentDir, 'fly.toml'), 'utf8');
  // Update dockerfile path to be relative to project root
  flyTomlContent = flyTomlContent.replace(
    /dockerfile = ".*"/,
    'dockerfile = "deployment/Dockerfile"'
  );
  const tempFlyToml = path.join(projectRoot, 'fly.toml');
  fs.writeFileSync(tempFlyToml, flyTomlContent);
  
  try {
    execSync('flyctl deploy', { 
      cwd: projectRoot,
      stdio: 'inherit'
    });
    console.log('\n✅ Deployment successful!\n');
    console.log('🌐 Your app should be available at: https://stego-app.fly.dev\n');
  } finally {
    // Clean up temp fly.toml
    if (fs.existsSync(tempFlyToml)) {
      fs.unlinkSync(tempFlyToml);
    }
  }
} catch (error) {
  console.error('\n❌ Deployment failed. Check the error messages above.\n');
  process.exit(1);
}
