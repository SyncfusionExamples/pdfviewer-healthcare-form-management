import { useRef, useState, useCallback } from 'react';
import type { JSX } from 'react';
import {
  PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
  ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner,
  PageOrganizer, Inject
} from '@syncfusion/ej2-react-pdfviewer';
import type { ToolbarSettingsModel } from '@syncfusion/ej2-react-pdfviewer';
import './App.css';

type TemplateKey = 'patient' | 'doctor' | 'template';

interface FormFieldInfo {
  name: string;
  type: string;
  value: string;
}

// Predefined document paths. Replace with your actual hosted PDF form files.
const DOCUMENT_PATHS: Record<TemplateKey, string> = {
  patient: window.location.origin + "/New_Patient_Form.pdf",
  doctor: window.location.origin + "/New_Patient_Form.pdf",
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
          if (field.value == "no") {
            value = field.isSelected ? 'No' : 'Yes';
          }
          if (field.value == "yes") {
            value = field.isSelected ? 'Yes' : 'No';
          }
        }  
        if (type === 'CheckBox') {
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
    const result: Blob | undefined = await pdfViewerRef.current?.saveAsBlob();
    if (!(result instanceof Blob)) {
      return;
    }
    const blobUrl = URL.createObjectURL(result);
    setEnableFormDesigner(false);
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