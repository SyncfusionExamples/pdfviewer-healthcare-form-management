import { useRef, useState, useCallback } from 'react';
import type { JSX } from 'react';
import {
  PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
  ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner,
  PageOrganizer, Inject, FormFieldDataFormat
} from '@syncfusion/ej2-react-pdfviewer';
import type { ToolbarSettingsModel } from '@syncfusion/ej2-react-pdfviewer';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import type { ChangeEventArgs } from '@syncfusion/ej2-react-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import './App.css';

type TemplateKey = 'patient' | 'doctor' | 'template';

interface FormFieldInfo {
  name: string;
  type: string;
  value: string;
}

// A predefined record of sample field values that can be imported into a
// form's fields. Keys must match the target PDF's form field names.
type SampleRecord = Record<string, string>;

interface SampleOption {
  text: string;
  value: string;
  data: SampleRecord;
}

// Predefined sample values for the Patient Intake Form. Update the field
// names (keys) below to match the actual field names in New_Patient_Form.pdf.
const PATIENT_SAMPLE_OPTIONS: SampleOption[] = [
  {
    text: 'John Anderson (AN-2026-001)',
    value: 'john-anderson',
    data: {
      'Name': 'John Anderson',
      'Last Name': 'Anderson',
      'Age': '41',
      'Gender': 'Male',
      'Alternate Number': 'AN-2026-001',
      'Phone Number': '(555) 123-4567',
      'Address': '456 Oak Street, Springfield, IL 62701',
      'Date': '2026-10-01',
      'Mime': '8 AM - 10 AM',
      'Physician': 'Dr. Gabor Maté – Psychiatry',
      'Previous Visit': 'yes',
      'Temperature': '98.6',
      'Pulse': '72',
      'Height': '5\'10"',
      'Weight': '185',
      'BMI': '26.5',
      'Systolic': '120',
      'Diastolic': '80',
      'Reason for visit': 'Routine Check-up and Wellness Consultation',
      'Symptoms': 'No acute symptoms. Patient reports overall well-being with mild fatigue.',
      'Diagnosis': 'Hypertension (Controlled), Type 2 Diabetes (Managed)',
      'Treatment': 'Continue current medications. Recommend exercise 3-4 times weekly.',
      'Next visit': '2026-11-01',
      'Blood Test': 'On',
      'X Ray': 'On',
      'Urine Test': 'On',
      'Ultra Sound': 'Off',
      'ECG': 'Off',
      'Endoscopy': 'Off',
      'CT Scan': 'On',
      'Biospy': 'Off',
      'MRI': 'On',
      'Bronchoscopy': 'Off'
    },
  },
  {
    text: 'Maria Garcia (AN-2026-002)',
    value: 'maria-garcia',
    data: {
      'Name': 'Maria Garcia',
      'Last Name': 'Garcia',
      'Age': '34',
      'Gender': 'Female',
      'Alternate Number': 'AN-2026-002',
      'Phone Number': '(555) 987-6543',
      'Address': '789 Maple Drive, Portland, OR 97201',
      'Date': '2026-10-02',
      'Time': '12 PM - 2 PM',
      'Physician': 'Dr. Sanjay Gupta – Neurosurgery',
      'Previous Visit': 'no',
      'Temperature': '98.2',
      'Pulse': '68',
      'Height': '5\'6"',
      'Weight': '125',
      'BMI': '20.2',
      'Systolic': '115',
      'Diastolic': '75',
      'Reason for visit': 'Asthma Management and Follow-up',
      'Symptoms': 'Occasional shortness of breath during exercise. Well-controlled otherwise.',
      'Diagnosis': 'Asthma (Persistent, Mild-Moderate)',
      'Treatment': 'Continue Albuterol inhaler. Consider preventive inhaler therapy.',
      'Next visit': '2026-11-15',
      'Blood Test': 'Off',
      'X Ray': 'On',
      'Urine Test': 'Off',
      'Ultra Sound': 'Off',
      'ECG': 'Off',
      'Endoscopy': 'Off',
      'CT Scan': 'Off',
      'Biospy': 'Off',
      'MRI': 'Off',
      'Bronchoscopy': 'Off'
    },
  },
  {
    text: 'Robert Johnson (AN-2026-003)',
    value: 'robert-johnson',
    data: {
      'Name': 'Robert Johnson',
      'Last Name': 'Johnson',
      'Age': '58',
      'Gender': 'Male',
      'Alternate Number': 'AN-2026-003',
      'Phone Number': '(555) 456-7890',
      'Address': '321 Pine Road, Denver, CO 80202',
      'Date': '2026-10-03',
      'Time': '3 PM - 5 PM',
      'Physician': 'Dr. Mehmet Oz – Cardiothoracic',
      'Previous Visit': 'yes',
      'Temperature': '98.5',
      'Pulse': '76',
      'Height': '5\'11"',
      'Weight': '195',
      'BMI': '27.2',
      'Systolic': '130',
      'Diastolic': '85',
      'Reason for visit': 'Quarterly Cardiovascular Check-up',
      'Symptoms': 'Occasional chest discomfort after heavy exertion. No dyspnea.',
      'Diagnosis': 'Hypertension (Moderate), Hyperlipidemia',
      'Treatment': 'Adjust blood pressure medication. Increase statin dose. Cardiac workup recommended.',
      'Next visit': '2027-01-03',
      'Blood Test': 'On',
      'X Ray': 'Off',
      'Urine Test': 'On',
      'Ultrasound': 'On',
      'ECG': 'On',
      'Endoscopy': 'Off',
      'CT Scan': 'On',
      'Biospy': 'Off',
      'MRI': 'Off',
      'Bronchoscopy': 'Off'
    }
  }
];

// Predefined sample values for the Doctor Form. Update the field names
// (keys) below to match the actual field names in Doctor_Medicine_Form.pdf.
const DOCTOR_SAMPLE_OPTIONS: SampleOption[] = [
  {
    text: 'Dr. Gabor Mate - Psychiatry',
    value: 'dr-gabor-mate',
    data: {
      "Patient Name": "John Anderson",
      "Age": "41",
      "Contact Number": "9876543210",
      "Medicine 1": "Paracetamol 500mg",
      "Medicine 2": "Vitamin D3",
      "Medicine 3": "Cetirizine",
      "Medicine 4": "Omeprazole",
      "Medicine 1 - Morning": "On",
      "Medicine 1 - Afternoon": "Off",
      "Medicine 1 - Night": "On",
      "Medicine 2 - Morning": "On",
      "Medicine 2 - Afternoon": "Off",
      "Medicine 2 - Night": "Off",
      "Medicine 3 - Morning": "Off",
      "Medicine 3 - Afternoon": "Off",
      "Medicine 3 - Night": "On",
      "Medicine 4 - Morning": "Off",
      "Medicine 4 - Afternoon": "On",
      "Medicine 4 - Night": "Off",
      "Date": "10/01/2026"
    }
  },
  {
    text: 'Dr. Sanjay Gupta - Neurosurgery',
    value: 'dr-sanjay-gupta',
    data: {
      "Patient Name": "Emily Roberts",
      "Age": "32",
      "Contact Number": "9123456789",
      "Medicine 1": "Metformin",
      "Medicine 2": "Aspirin",
      "Medicine 3": "Multivitamin",
      "Medicine 4": "Amoxicillin",
      "Medicine 1 - Morning": "On",
      "Medicine 1 - Afternoon": "On",
      "Medicine 1 - Night": "On",
      "Medicine 2 - Morning": "Off",
      "Medicine 2 - Afternoon": "On",
      "Medicine 2 - Night": "Off",
      "Medicine 3 - Morning": "On",
      "Medicine 3 - Afternoon": "Off",
      "Medicine 3 - Night": "Off",
      "Medicine 4 - Morning": "On",
      "Medicine 4 - Afternoon": "Off",
      "Medicine 4 - Night": "On",
      "Date": "10/01/2026"
    }
  },
  {
    text: 'Dr. Mehmet Oz - Cardiothoracic',
    value: 'dr-mehmet-oz',
    data: {
      "Patient Name": "Michael Davis",
      "Age": "58",
      "Contact Number": "9988776655",
      "Medicine 1": "Atorvastatin",
      "Medicine 2": "Losartan",
      "Medicine 3": "Calcium Tablet",
      "Medicine 4": "Pantoprazole",
      "Medicine 1 - Morning": "Off",
      "Medicine 1 - Afternoon": "Off",
      "Medicine 1 - Night": "On",
      "Medicine 2 - Morning": "On",
      "Medicine 2 - Afternoon": "Off",
      "Medicine 2 - Night": "On",
      "Medicine 3 - Morning": "On",
      "Medicine 3 - Afternoon": "On",
      "Medicine 3 - Night": "Off",
      "Medicine 4 - Morning": "Off",
      "Medicine 4 - Afternoon": "Off",
      "Medicine 4 - Night": "On",
      "Date": "10/01/2026"
    }
  }
];

// Maps each fillable template to its predefined sample dropdown options.
const SAMPLE_OPTIONS_BY_TEMPLATE: Partial<Record<TemplateKey, SampleOption[]>> = {
  patient: PATIENT_SAMPLE_OPTIONS,
  doctor: DOCTOR_SAMPLE_OPTIONS,
};

// Predefined document paths. Replace with your actual hosted PDF form files.
const DOCUMENT_PATHS: Record<TemplateKey, string> = {
  patient: window.location.origin + "/New_Patient_Form.pdf",
  doctor: window.location.origin + "/Doctor_Medicine_Form.pdf",
  template: window.location.origin + "/Empty_Pdf.pdf",
};

const TEMPLATE_LABELS: Record<TemplateKey, string> = {
  patient: 'Patient Intake Form',
  doctor: 'Doctor Form',
  template: 'Create Your Own Template'
};

// Toolbar for "Create Your Own Template" (designer) mode - includes the
// Form Designer edit tool so fields can be added/moved/resized/deleted.
const DESIGNER_TOOLBAR_SETTINGS: ToolbarSettingsModel = {
  showTooltip: true,
  toolbarItems: [
    'OpenOption',
    'UndoRedoTool',
    'PageNavigationTool',
    'MagnificationTool',
    'PanTool',
    'SelectionTool',
    'CommentTool',
    'SubmitForm',
    'AnnotationEditTool',
    'FormDesignerEditTool',
    'SearchOption',
    'PrintOption',
    'DownloadOption'
  ]
};

// Toolbar for standard form-filling mode (Patient/Doctor forms, or a
// finished template) - the Form Designer edit tool is omitted.
const FILL_TOOLBAR_SETTINGS: ToolbarSettingsModel = {
  showTooltip: true,
  toolbarItems: [
    'OpenOption',
    'UndoRedoTool',
    'PageNavigationTool',
    'MagnificationTool',
    'PanTool',
    'SelectionTool',
    'CommentTool',
    'SubmitForm',
    'AnnotationEditTool',
    'SearchOption',
    'PrintOption',
    'DownloadOption'
  ]
};

export default function App(): JSX.Element {
  const [activeTemplate, setActiveTemplate] = useState<TemplateKey | null>(null);
  const [enableFormDesigner, setEnableFormDesigner] = useState<boolean>(false);
  const [documentPath, setDocumentPath] = useState<string>('');
  const [formFields, setFormFields] = useState<FormFieldInfo[]>([]);
  const [isTemplateFinished, setIsTemplateFinished] = useState<boolean>(false);
  const [selectedSampleValue, setSelectedSampleValue] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfViewerRef = useRef<any>(null);

  // Reads all current form fields from the viewer and syncs the right-side panel.
  const refreshFormFieldsPanel = useCallback(() => {
    const retrievedFields = pdfViewerRef.current?.retrieveFormFields();
    if (retrievedFields && Array.isArray(retrievedFields)) {
      const seenNames = new Set<string>();
      const mapped: FormFieldInfo[] = [];
      retrievedFields.forEach((field: any) => {
        const name = field.name ?? 'Unnamed';
        if (seenNames.has(name)) {
          return;
        }
        seenNames.add(name);
        const type = field.type ?? 'Unknown';
        // RadioButton/CheckBox fields don't carry a meaningful "value" string;
        // their selection state is exposed via isSelected/isChecked instead.
        let value: string = field.value !== undefined && field.value !== null ? String(field.value) : '';
        if (type === 'RadioButton') {
          value = field.isSelected ? 'Yes' : 'No';
        }  
        if (type === 'Checkbox') {
          value = field.isChecked ? 'Yes' : 'No';
        }
        mapped.push({ name, type, value });
      });
      setFormFields(mapped);
    }
  }, []);

  const openTemplate = (key: TemplateKey): void => {
    setActiveTemplate(key);
    setDocumentPath(DOCUMENT_PATHS[key]);
    setIsTemplateFinished(false);
    setFormFields([]);
    setSelectedSampleValue(null);
    // Patient Intake & Doctor Form -> form filling mode (designer disabled).
    // Create Your Own Template -> form designer enabled.
    setEnableFormDesigner(key === 'template');
  };

  const goHome = (): void => {
    setActiveTemplate(null);
    setDocumentPath('');
    setFormFields([]);
    setIsTemplateFinished(false);
    setEnableFormDesigner(false);
    setSelectedSampleValue(null);
  };

  // Tracks the dropdown's current selection (sample record) so "Fill Form"
  // knows which predefined values to import.
  const handleSampleSelect = (args: ChangeEventArgs): void => {
    setSelectedSampleValue((args.value as string) ?? null);
  };

  // Imports the selected sample record's values into the PDF form fields.
  const handleFillForm = (): void => {
    if (!activeTemplate || !selectedSampleValue || !pdfViewerRef.current) {
      return;
    }
    const options = SAMPLE_OPTIONS_BY_TEMPLATE[activeTemplate];
    const selectedOption = options?.find((option) => option.value === selectedSampleValue);
    if (!selectedOption) {
      return;
    }
    pdfViewerRef.current.importFormFields(JSON.stringify(selectedOption.data), FormFieldDataFormat.Json);
    refreshFormFieldsPanel();
  };

  // Triggered once the document finishes loading - populate the panel initially.
  const handleDocumentLoad = (): void => {
    refreshFormFieldsPanel();
  };

  // Keeps the right panel synchronized whenever a form field property changes.
  const handleFormFieldPropertiesChange = (): void => {
    refreshFormFieldsPanel();
  };

  // Keeps the right panel synchronized whenever the user edits a field value (fill mode).
  const handleFormFieldFocusOut = (): void => {
    refreshFormFieldsPanel();
  };

  // Keeps the right panel synchronized when fields are added/removed/moved/resized (designer mode).
  const handleFormFieldAdd = (): void => {
    refreshFormFieldsPanel();
  };

  const handleFormFieldRemove = (): void => {
    refreshFormFieldsPanel();
  };

  const handleFormFieldMove = (): void => {
    refreshFormFieldsPanel();
  };

  const handleFormFieldResize = (): void => {
    refreshFormFieldsPanel();
  };

  // "Finish Template": saves the designed template, reloads it as a blob,
  // disables the designer, and switches to standard form-fill mode.
  const handleFinishTemplate = async (): Promise<void> => {
    setEnableFormDesigner(false);
    const result: Blob | undefined = await pdfViewerRef.current?.saveAsBlob();
    if (!(result instanceof Blob)) {
      return;
    }
    const blobUrl = URL.createObjectURL(result);
    setDocumentPath(blobUrl);
    setIsTemplateFinished(true);
    setFormFields([]);
  };

  if (!activeTemplate) {
    return (
      <div className="home-container">
        <div className="home-intro">
          <span className="home-eyebrow">PDF Workspace</span>
          <h1 className="home-title">PDF Form Center</h1>
          <p className="home-subtitle">
            Choose a predefined form to fill, or design your own fillable PDF template from scratch.
          </p>
        </div>
        <div className="home-cards">
          <button className="home-card" onClick={() => openTemplate('patient')}>
            <span className="home-card-icon" aria-hidden="true">🩺</span>
            <span className="home-card-title">Patient Intake Form</span>
            <span className="home-card-desc">Fill out the standard patient intake PDF form.</span>
            <span className="home-card-cta">Open form →</span>
          </button>
          <button className="home-card" onClick={() => openTemplate('doctor')}>
            <span className="home-card-icon" aria-hidden="true">🩻</span>
            <span className="home-card-title">Doctor Form</span>
            <span className="home-card-desc">Fill out the standard doctor PDF form.</span>
            <span className="home-card-cta">Open form →</span>
          </button>
          <button className="home-card home-card-accent" onClick={() => openTemplate('template')}>
            <span className="home-card-icon" aria-hidden="true">✏️</span>
            <span className="home-card-title">Create Your Own Template</span>
            <span className="home-card-desc">Design a custom PDF form with the Form Designer.</span>
            <span className="home-card-cta">Start designing →</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="viewer-page">
      <div className="viewer-header">
        <button className="back-button" onClick={goHome}>
          <span aria-hidden="true">&larr;</span> Back
        </button>
        <div className="viewer-header-text">
          <h2 className="viewer-title">{TEMPLATE_LABELS[activeTemplate]}</h2>
          <span className="viewer-subtitle">
            {enableFormDesigner
              ? 'Form Designer mode — add, move, resize, or delete fields'
              : 'Form Fill mode — enter values into the fields'}
          </span>
        </div>
        {(activeTemplate === 'patient' || activeTemplate === 'doctor') && (
          <div className="sample-fill-controls">
            <div className="sample-dropdown-wrapper">
              <DropDownListComponent
                id="sampleRecordDropdown"
                dataSource={SAMPLE_OPTIONS_BY_TEMPLATE[activeTemplate] as unknown as { [key: string]: object }[]}
                fields={{ text: 'text', value: 'value' }}
                placeholder="Select predefined values"
                value={selectedSampleValue}
                change={handleSampleSelect}
                popupHeight="220px"
              />
            </div>
            <ButtonComponent
              cssClass="e-primary"
              disabled={!selectedSampleValue}
              onClick={handleFillForm}
            >
              Fill Form
            </ButtonComponent>
          </div>
        )}
        {activeTemplate === 'template' && !isTemplateFinished && (
          <button className="finish-button" onClick={handleFinishTemplate}>
            ✓ Finish Template
          </button>
        )}
      </div>
      <div className="viewer-body">
        <div className="viewer-center">
          <PdfViewerComponent
            id="pdfViewer"
            ref={pdfViewerRef}
            documentPath={documentPath}
            resourceUrl="https://cdn.syncfusion.com/ej2/34.1.29/dist/ej2-pdfviewer-lib"
            isFormDesignerToolbarVisible={enableFormDesigner}
            toolbarSettings={enableFormDesigner ? DESIGNER_TOOLBAR_SETTINGS : FILL_TOOLBAR_SETTINGS}
            documentLoad={handleDocumentLoad}
            formFieldPropertiesChange={handleFormFieldPropertiesChange}
            formFieldFocusOut={handleFormFieldFocusOut}
            formFieldAdd={handleFormFieldAdd}
            formFieldRemove={handleFormFieldRemove}
            formFieldMove={handleFormFieldMove}
            formFieldResize={handleFormFieldResize}
            style={{ height: '100%' }}
          >
            <Inject services={[
              Toolbar, Magnification, Navigation, Annotation, LinkAnnotation,
              BookmarkView, ThumbnailView, Print, TextSelection, TextSearch,
              FormFields, FormDesigner, PageOrganizer
            ]} />
          </PdfViewerComponent>
        </div>
        <div className="viewer-sidebar">
          <div className="sidebar-header">
            <h3 className="sidebar-title">Form Fields</h3>
            <span className="sidebar-count">{formFields.length}</span>
          </div>
          {formFields.length === 0 && (
            <div className="sidebar-empty">
              <span className="sidebar-empty-icon" aria-hidden="true">📄</span>
              <p>No form fields found yet.</p>
            </div>
          )}
          <ul className="sidebar-field-list">
            {formFields.map((field, index) => (
              <li className="sidebar-field-item" key={`${field.name}-${index}`}>
                <div className="sidebar-field-item-head">
                  <span className="sidebar-field-name">{field.name}</span>
                  <span className="sidebar-field-type">{field.type}</span>
                </div>
                <div className={`sidebar-field-value${field.value ? '' : ' is-empty'}`}>
                  {field.value || 'empty'}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}