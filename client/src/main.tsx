import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// To export early users: Open browser console and type: exportEarlyUsers()
(window as any).exportEarlyUsers = function() {
  try {
    const data = JSON.parse(localStorage.getItem('earlyUsers') || '[]');
    
    if (data.length === 0) {
      console.log('No early user data found.');
      return;
    }

    // CSV Headers
    const headers = ['Email', 'Name', 'Company', 'User Type', 'Challenge', 'Wanted Features', 'Other Feature', 'Submitted Date'];
    
    // Convert data to CSV rows
    const csvRows = data.map((user: any) => [
      user.email || '',
      user.name || '',
      user.company || '',
      user.userType || '',
      `"${(user.challenge || '').replace(/"/g, '""')}"`, // Escape quotes
      `"${(user.wantedFeatures || []).join(', ')}"`,
      `"${(user.otherFeature || '').replace(/"/g, '""')}"`,
      new Date(user.submittedAt).toLocaleString()
    ]);

    // Create CSV content
    const csvContent = [headers, ...csvRows]
      .map(row => row.join(','))
      .join('\n');

    // Console log for copy/paste
    console.log('=== EARLY USER DATA (CSV FORMAT) ===');
    console.log(csvContent);
    console.log(`\n=== SUMMARY: ${data.length} early users exported ===`);

    // Trigger automatic download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `screenlocal_early_users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('Early user data exported. Check downloads folder for CSV file.');
  } catch (error) {
    console.error('Error exporting early user data:', error);
  }
};

createRoot(document.getElementById("root")!).render(<App />);
