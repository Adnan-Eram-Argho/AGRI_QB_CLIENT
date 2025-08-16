/**
 * CSV uploader component for bulk import
 * 
 * Environment Variables:
 * - None
 */

import { useState } from 'react';
import Papa from 'papaparse';
import api from '../services/api.js';
import toast from 'react-hot-toast';

const CSVUploader = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      
      // Parse CSV for preview
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setPreview(results.data.slice(0, 5)); // Show first 5 rows
        },
        error: (error) => {
          toast.error('Error parsing CSV file');
          console.error(error);
        },
      });
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('csv', file);
      
      await api.post('/questions/bulk-import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Questions imported successfully');
      setFile(null);
      setPreview([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to import questions');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        title: 'Sample Question Title',
        body: 'This is a sample question body text.',
        course_code: 'ECON101',
        year: '2023',
        exam_type: 'final',
        question_type: 'short',
        difficulty: 'medium',
        tags: 'macroeconomics,supply-demand',
      },
    ];
    
    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'question_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Import Questions from CSV</h3>
        <p className="text-gray-400 mb-4">
          Upload a CSV file with questions to import them in bulk. 
          <button
            onClick={downloadTemplate}
            className="text-blue-400 hover:text-blue-300 ml-2"
          >
            Download template
          </button>
        </p>
        
        <div className="mb-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700
            "
          />
        </div>
        
        {file && (
          <div className="mb-4">
            <p className="mb-2">Preview (first 5 rows):</p>
            <div className="bg-gray-700 p-4 rounded-lg overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    {preview.length > 0 && Object.keys(preview[0]).map((key) => (
                      <th key={key} className="px-4 py-2 text-left">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="px-4 py-2">{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50 transition"
        >
          {uploading ? 'Importing...' : 'Import Questions'}
        </button>
      </div>
    </div>
  );
};

export default CSVUploader;