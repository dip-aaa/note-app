// Run this script in your browser console to clear authentication
console.log('🔧 Clearing authentication state...');

// Clear all localStorage
localStorage.clear();

// Clear all sessionStorage  
sessionStorage.clear();

// Clear specific Supabase authentication keys (just in case)
const authKeys = [
    'supabase.auth.token',
    'supabase.auth.user', 
    'sb-npdypxotrbyflwkbftbf-auth-token',
    'sb-npdypxotrbyflwkbftbf-auth-user',
    'supabase.auth.refreshToken',
    'supabase.auth.expiresAt'
];

authKeys.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
});

console.log('✅ Authentication cleared!');
console.log('🔄 Reloading page...');

// Reload the page to show login
window.location.reload();
