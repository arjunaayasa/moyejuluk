// Environment configuration
// IMPORTANT: In production, use .env file and don't commit this file

export const config = {
    // Supabase
    supabase: {
        url: 'https://yyxkjrreqmmtwgobhgog.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5eGtqcnJlcW1tdHdnb2JoZ29nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyODkyNzYsImV4cCI6MjA4Mzg2NTI3Nn0.jiMWug-ptvCeCkaNpW_fq9lnsWoR826cr0Wyuxrar6Q',
    },

    // Tripay Payment Gateway
    tripay: {
        apiKey: 'DEV-mtFXcCFWtbYydCuFO8oM6ksmS5n1W59rrUqg88Un',
        privateKey: 'kqMYL-pXCNh-uzDQj-lppMG-28iZ5',
        merchantCode: 'T31321',
        baseUrl: 'https://tripay.co.id/api-sandbox', // Use api for production
    },

    // Subscription
    subscription: {
        monthlyPrice: 10000, // Rp 10.000
        trialDramaLimit: 3,
        trialKomikLimit: 3,
    },
};
