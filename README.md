# PDF Viewer Healthcare Form Management

A modern healthcare form management application built with React, TypeScript, Vite, and Syncfusion PDF Viewer. This application allows users to view, fill, and manage patient intake forms and medical records with an intuitive interface.

## Getting Started

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd pdfviewer-healthcare-form-management
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## How the Sample Application Works

### Application Flow

The sample demonstrates a complete healthcare form management system with three distinct workflows:

#### 1. **Home Screen (Template Selection)**
When you launch the application, you see the home screen with three card options:
- 🩺 **Patient Intake Form** - Fill out patient information and medical history
- 🩻 **Doctor Form** - Manage medical prescriptions and treatment details
- ✏️ **Create Your Own Template** - Design custom fillable PDF forms from scratch

#### 2. **Patient Intake Form Workflow**
This demonstrates the core form-filling functionality:

- **Select a Patient**: Choose from 3 pre-configured patient records:
  - **John Anderson** (AN-2026-001) - 41-year-old male, routine check-up with hypertension and diabetes management
  - **Maria Garcia** (AN-2026-002) - 34-year-old female, asthma management follow-up
  - **Robert Johnson** (AN-2026-003) - 58-year-old male, quarterly cardiovascular check-up

- **Fill Form**: Click the "Fill Form" button to auto-populate all form fields with the selected patient's data, including:
  - Personal information (name, age, contact details, address)
  - Vital signs (temperature, pulse, height, weight, blood pressure, BMI)
  - Medical history and diagnosis
  - Treatment recommendations
  - Test requirements (Blood Test, X-Ray, CT Scan, MRI, etc.)

- **View Fields**: The right sidebar displays all detected form fields in real-time, showing:
  - Field name
  - Field type (Text, Checkbox, RadioButton, etc.)
  - Current value or "empty" if not filled

#### 3. **Doctor Form Workflow**
Similar to the Patient Intake form, but focused on medical prescriptions:

- **Select a Doctor**: Choose from 3 pre-configured doctor records:
  - Dr. Gabor Mate (Psychiatry) - 4 medications with time-based scheduling
  - Dr. Sanjay Gupta (Neurosurgery) - Various medication combinations
  - Dr. Mehmet Oz (Cardiothoracic) - Cardiac-focused prescriptions

- **Auto-Fill Prescriptions**: Populate the form with medications and dosage schedules (Morning/Afternoon/Night)

#### 4. **Form Designer (Create Your Own Template)**
This demonstrates the Form Designer functionality for building custom templates:

- **Designer Mode**: All form editing tools are enabled (add, move, resize, delete fields)
- **Add Fields**: Use the toolbar to insert text fields, checkboxes, radio buttons, etc.
- **Finish Template**: When done designing, click "Finish Template" to convert it to a fillable form
- **Save & Reuse**: The custom template is saved as a blob and can be immediately used to fill in data


## Documentations

- [Syncfusion PDF Viewer SDK](https://www.syncfusion.com/pdf-viewer-sdk)
- [Getting Started with React PDF Viewer](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/react/getting-started)

