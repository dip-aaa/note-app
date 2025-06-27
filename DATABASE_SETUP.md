# Database Setup Instructions

To set up the database for your Todo List app, follow these steps:

## 1. Access Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: `npdypxotrbyflwkbftbf`

## 2. Run the SQL Script

1. In your Supabase dashboard, navigate to the **SQL Editor** (in the left sidebar)
2. Click **New query**
3. Copy the contents of `database_setup.sql` file
4. Paste it into the SQL editor
5. Click **Run** to execute the script

## 3. Verify Tables

1. Go to **Table Editor** in the left sidebar
2. You should see a new table called `todos`
3. The table should have the following columns:
   - `id` (bigint, primary key)
   - `user_id` (uuid, foreign key to auth.users)
   - `task` (text)
   - `completed` (boolean)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

## 4. Configure Authentication Settings (Optional)

1. Go to **Authentication** > **Settings**
2. Under **Site URL**, add: `http://localhost:3000`
3. Under **Redirect URLs**, add: `http://localhost:3000`

## 5. Test the Application

1. Start your React app: `npm start`
2. Register a new account or sign in
3. Try adding, checking, and deleting todos

## Security Features

The database setup includes:
- **Row Level Security (RLS)** - Users can only access their own todos
- **Authentication policies** - Proper CRUD permissions for authenticated users
- **Automatic timestamps** - `updated_at` field is automatically updated

## Troubleshooting

If you encounter issues:
1. Make sure you're signed in to the correct Supabase project
2. Check the browser console for any error messages
3. Verify that the SQL script ran without errors
4. Ensure your Supabase keys are correctly configured in `supabaseClient.js`
