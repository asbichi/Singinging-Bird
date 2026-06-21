import { db } from './firebase';
import { collection, addDoc, getDocs, writeBatch, doc } from 'firebase/firestore';

const SUBJECTS = ['EXCEL', 'MICROSOFT WORD', 'POWERPOINT', 'WINDOWS OPERATION'];
const Q_PER_SUBJECT = 150;

const EXCEL_BASE = [
  {
    text: "Which of the following describes a major functional limitation of the VLOOKUP function in Microsoft Excel?",
    options: ["It cannot search for values to the left of the lookup column.", "It cannot handle duplicate values in the source array.", "It does not support exact matching.", "It is limited to a maximum of 1,000 reference rows."],
    answer: "It cannot search for values to the left of the lookup column."
  },
  {
    text: "How does the combination of INDEX and MATCH compare to standard VLOOKUP in worksheet performance?",
    options: ["INDEX/MATCH is more versatile, handles left-side lookups, and offers better performance on large sheets.", "INDEX/MATCH requires less memory but cannot handle nested Boolean operations.", "INDEX/MATCH can only function when referencing external workbooks.", "INDEX/MATCH requires contiguous arrays and cannot be combined with IFERROR."],
    answer: "INDEX/MATCH is more versatile, handles left-side lookups, and offers better performance on large sheets."
  },
  {
    text: "Which of the following formula designs correctly utilizes SUMPRODUCT to extract a weighted average of scores in range A2:A10 using weights in B2:B10?",
    options: ["=SUMPRODUCT(A2:A10, B2:B10) / SUM(B2:B10)", "=SUMPRODUCT(A2:A10, B2:B10) * SUM(B2:B10)", "=SUMPRODUCT(A2:A10) / SUM(B2:B10)", "=SUMPRODUCT(A2:A10, B2:B10) + AVERAGE(B2:B10)"],
    answer: "=SUMPRODUCT(A2:A10, B2:B10) / SUM(B2:B10)"
  },
  {
    text: "In modern Excel (Dynamic Arrays), what is the function of the '#' symbol (e.g., A2#) when appended to a cell reference?",
    options: ["It references the entire dynamic spilled range starting at cell A2.", "It marks the range as a read-only absolute reference.", "It forces the reference to compile as a raw text string.", "It triggers an automatic recursive error suppression filter."],
    answer: "It references the entire dynamic spilled range starting at cell A2."
  },
  {
    text: "What is the primary benefit of utilizing nested IF statements with AND/OR logical operators over single-case IF statements?",
    options: ["They allow testing of multiple independent complex conditions in a structured decision branch.", "They increase recalculation times across massive datasets.", "They eliminate the requirement to define cells as absolute references.", "They automatically repair circular reference errors in linked workbooks."],
    answer: "They allow testing of multiple independent complex conditions in a structured decision branch."
  },
  {
    text: "When auditing a complex corporate model, which diagnostic tool allows you to visually map cells that feed data directly to a selected formula cell?",
    options: ["Trace Precedents", "Trace Dependents", "Pivot Chart Tracer", "Show Formulas View"],
    answer: "Trace Precedents"
  },
  {
    text: "Which financial function calculates the net present value of an investment using a designated discount rate and a series of future periodic cash flows?",
    options: ["NPV", "PV", "IRR", "PMT"],
    answer: "NPV"
  },
  {
    text: "When a Pivot Table is created, why might some changes in the source data sheet not refresh in the pivot layout immediately?",
    options: ["Pivot Tables do not automatically refresh and require a manual 'Refresh' action or VBA trigger.", "The source cells must be locked before values can integrate.", "An Access link must be initiated to execute automatic updates.", "The sheet must be saved inside a binary workbook (.xlsb) layout."],
    answer: "Pivot Tables do not automatically refresh and require a manual 'Refresh' action or VBA trigger."
  },
  {
    text: "What is the precise logical mechanism of the IFERROR function in advanced Excel formulas?",
    options: ["To evaluate a formula and return a custom alternative value if an error is computed.", "To highlight spelling errors in formulas automatically.", "To prevent the user from typing invalid coordinates in a cell.", "To delete the workbook formulas if an error occurs."],
    answer: "To evaluate a formula and return a custom alternative value if an error is computed."
  },
  {
    text: "In Excel Solver, what does the 'Objective Cell' represent in optimization models?",
    options: ["The target cell containing a formula that you want to maximize, minimize, or set to a specific value.", "The cell containing the independent variables that Solver modifies.", "The cell that contains the logical constraints of the calculation.", "Any cell that cannot be formatted as a floating-point integer."],
    answer: "The target cell containing a formula that you want to maximize, minimize, or set to a specific value."
  },
  {
    text: "Which of the following describes the behavior of Excel's Flash Fill feature?",
    options: ["It recognizes patterns in user input and automatically formats/extracts adjacent text strings without formulas.", "It converts basic formulas into encrypted VBA macro procedures.", "It establishes a real-time web socket to fetch external datasets.", "It validates numeric inputs to prevent overflow and divide-by-zero errors."],
    answer: "It recognizes patterns in user input and automatically formats/extracts adjacent text strings without formulas."
  },
  {
    text: "How does the modern XLOOKUP function overcome the structural pitfalls of horizontal and vertical searches over VLOOKUP?",
    options: ["It defaults to exact matches, looks up values left or right, and handles horizontal or vertical arrays natively.", "It encrypts lookup values to improve worksheet multi-threaded computation speed.", "It operates exclusively in safe-mode with automatic error reporting to cloud administrators.", "It automatically links external SQL tables and creates corresponding primary keys."],
    answer: "It defaults to exact matches, looks up values left or right, and handles horizontal or vertical arrays natively."
  },
  {
    text: "If multiple conditional formatting rules evaluate to TRUE on a cell, what determines the final style output?",
    options: ["The rule with the highest precedence in the Manager list applies, and other rules apply if they do not conflict.", "Excel crashes due to evaluation conflict.", "Only the newest rule is applied; other matching rules are auto-deleted.", "Formatting rules are completely suspended to safeguard system resources."],
    answer: "The rule with the highest precedence in the Manager list applies, and other rules apply if they do not conflict."
  },
  {
    text: "What does the Excel error alert '#REF!' indicate?",
    options: ["A formula refers to a cell that has been deleted or overridden.", "A calculation was divided by a value of zero.", "The formula is missing an opening or closing parenthesis.", "The worksheet contains conflicting conditional formats."],
    answer: "A formula refers to a cell that has been deleted or overridden."
  },
  {
    text: "When a worksheet's structure is locked and 'Protected', what is the default restriction on cell modification?",
    options: ["Locked cells cannot be edited, while unlocked cells remain editable according to permission settings.", "All cells are completely hidden and formulas are terminated.", "A master security password must be entered on every cell edit.", "Cell references are converted permanently into string constants."],
    answer: "Locked cells cannot be edited, while unlocked cells remain editable according to permission settings."
  }
];

const WORD_BASE = [
  {
    text: "To allow different headers, footers, or page numbering styles in different chapters of a single Word document, which element must be inserted?",
    options: ["Section Break (Next Page)", "Page Break", "Column Break", "Text Wrapping Break"],
    answer: "Section Break (Next Page)"
  },
  {
    text: "What is the primary architectural advantage of systematically applying hierarchical Heading Styles in Word?",
    options: ["It enables the automated compilation and updating of a dynamic Table of Contents.", "It compresses document asset size and speeds up local storage times.", "It disables automatic word wrap and aligns tables.", "It prevents unauthorized collaborators from modifying heading layouts."],
    answer: "It enables the automated compilation and updating of a dynamic Table of Contents."
  },
  {
    text: "In Microsoft Word Mail Merge transactions, which file defines the data records (names, addresses, IDs) that populate merge fields?",
    options: ["Data Source", "Master Template", "Header Source", "VBA Manifest"],
    answer: "Data Source"
  },
  {
    text: "How can you lock down a distributed document so users can fill in form fields but cannot alter general styles or layout orientation?",
    options: ["Restrict Editing -> Limit formatting and editing permissions", "Save as an uncompressed plain text file (.txt)", "Encrypt the docx container with a system ZIP utility", "Activate Track Changes with a personal author watermark"],
    answer: "Restrict Editing -> Limit formatting and editing permissions"
  },
  {
    text: "What is the primary utility of the 'Navigation Pane' in Microsoft Word during major monograph compilation?",
    options: ["To browse document hierarchy headings, full-text pages, and search queries dynamically.", "To establish high-performance multi-column layouts across sections.", "To pull research citation indices from cloud-based open repositories.", "To manage and compress master images and embedded drawings."],
    answer: "To browse document hierarchy headings, full-text pages, and search queries dynamically."
  },
  {
    text: "Which Word feature enables multiple co-authors to modify a document, allowing the principal editor to accept or reject changes individual-by-individual?",
    options: ["Track Changes", "AutoCorrect", "Document Compare", "Document Protect Style"],
    answer: "Track Changes"
  },
  {
    text: "Which of the following defines a 'Style' inside Microsoft Word's formatting engine?",
    options: ["A predefined collection of formatting attributes (font, size, color, alignment) applied to text as a unit.", "A script used to index and catalog document tables of contents.", "An XML-based schema applied to validate external developer templates.", "A multi-threaded background protocol used to cross-compile doc files."],
    answer: "A predefined collection of formatting attributes (font, size, color, alignment) applied to text as a unit."
  },
  {
    text: "Which advanced key combination allows an author to toggle between displaying actual raw field codes (formula tags) and their rendered outcomes?",
    options: ["Alt + F9", "Ctrl + Spacebar", "Shift + F5", "F12"],
    answer: "Alt + F9"
  },
  {
    text: "What is the standard underlying file architecture of modern Word (.docx) files introduced from Word 2007?",
    options: ["An XML-based ZIP package containing folders of media, styling, and structural schemas.", "A raw binary text container with proprietary ASCII mappings.", "A serialized JSON stream with compiled Python binary structures.", "A single uncompressed HTML file with embedded base64 assets."],
    answer: "An XML-based ZIP package containing folders of media, styling, and structural schemas."
  },
  {
    text: "In Word's advanced layout settings, what does the Paragraph option 'Keep with Next' do under text flow controls?",
    options: ["It prevents a page break from splitting the current paragraph and the following paragraph.", "It keeps the document connected to the cloud synchronization server.", "It merges identical formatting structures between contiguous text blocks.", "It links multi-column text boxes together dynamically."],
    answer: "It prevents a page break from splitting the current paragraph and the following paragraph."
  }
];

const POWERPOINT_BASE = [
  {
    text: "What is the primary design purpose of the 'Slide Master' in Microsoft PowerPoint?",
    options: ["To establish default formatting, layouts, and background designs across all template slides.", "To display current presenter scripts and elapsed timers for dual-projection setups.", "To automate slide transitions using custom macro triggers.", "To convert presentation assets into high-efficiency video formats."],
    answer: "To establish default formatting, layouts, and background designs across all template slides."
  },
  {
    text: "Under what scenario should a slide show be configured to run in 'Kiosk Mode' (Browsed at a kiosk)?",
    options: ["When the presentation is self-running and needs to disable manual mouse clicks to advance slides.", "When presenting to a large auditorium with dual-screen projection.", "When the slides contain embedded high-definition videos with nested subtitles.", "When the slide deck requires a secure real-time internet connection to fetch statistics."],
    answer: "When the presentation is self-running and needs to disable manual mouse clicks to advance slides."
  },
  {
    text: "Which PowerPoint feature displays upcoming slides, timing, and local notes on the presenter's screen while the audience sees the main presentation slide?",
    options: ["Presenter View", "Outline View", "Slide Sorter View", "Master Layout Split"],
    answer: "Presenter View"
  },
  {
    text: "What is the principal distinction between slide Transitions and slide Animations in presentation design?",
    options: ["Transitions govern movement between slides; animations govern movement of objects inside a single slide.", "Transitions apply to text, whereas animations apply to vectors and charts.", "Transitions are rendered via the CPU, while animations are sent to GPU engines.", "Transitions can have audio cues, while animations cannot."],
    answer: "Transitions govern movement between slides; animations govern movement of objects inside a single slide."
  },
  {
    text: "How can you optimize and reduce the file size of a PowerPoint presentation containing multiple large embedded video files?",
    options: ["Use Compress Media under Info settings to decrease video resolution and scale files.", "Save the slide deck as a password-secured presentation file (.ppsx).", "Convert all paragraph configurations to web-safe formatting styles.", "Re-apply formatting master layouts to clear cached styles."],
    answer: "Use Compress Media under Info settings to decrease video resolution and scale files."
  },
  {
    text: "Which PowerPoint animation type should be used when an object behaves according to a customized curve or line mapped across a slide?",
    options: ["Motion Paths", "Entrance Triggers", "Emphasis Indicators", "Transition Durations"],
    answer: "Motion Paths"
  },
  {
    text: "What is the primary purpose of a 'Hyperlink' mapping or 'Action Button' in a non-linear presentation design?",
    options: ["To jump directly to a specific slide, external URL, or local document upon user interaction.", "To calculate statistical calculations on a designated grid layout.", "To connect the presentation master coordinates with an Access Database file.", "To translate slide elements into multiple global languages."],
    answer: "To jump directly to a specific slide, external URL, or local document upon user interaction."
  },
  {
    text: "When exporting a PowerPoint template as a standalone video file, which outputs are natively supported?",
    options: ["MPEG-4 (.mp4) and Windows Media Video (.wmv)", "Flash Video (.flv) and Shockwave Vector (.swf)", "QuickTime Video (.mov) and Avi Container (.avi)", "Ogg Video Stream (.ogv) and WebM formats"],
    answer: "MPEG-4 (.mp4) and Windows Media Video (.wmv)"
  },
  {
    text: "What is 'SmartArt' in Microsoft PowerPoint?",
    options: ["A tool to easily build customizable, professional diagrams, organizational charts, and process flows.", "An AI prompter that auto-writes script drafts.", "A portal used to download stock photography overlays.", "A tool that converts handwriting to vector shapes."],
    answer: "A tool to easily build customizable, professional diagrams, organizational charts, and process flows."
  },
  {
    text: "To modify the aspect ratio of slides from Legacy Standard (4:3) to modern Widescreen (16:9), under which tab is the control located?",
    options: ["Design -> Slide Size", "Home -> Layout", "Transitions -> Options", "View -> Slider Layouts"],
    answer: "Design -> Slide Size"
  }
];

const WINDOWS_BASE = [
  {
    text: "In Windows Administration, which tool allows a system administrator to manage startup services, configure boot paths, and boot into safe mode?",
    options: ["System Configuration (msconfig)", "Device Manager", "Disk Management", "Registry Editor"],
    answer: "System Configuration (msconfig)"
  },
  {
    text: "Which PowerShell cmdlet should be used to display a detailed summary of Group Policy Objects (GPOs) applied to the current user or computer?",
    options: ["Get-GPResultantSetOfPolicy", "gpupdate /force", "Get-GPO", "Test-ComputerSecureChannel"],
    answer: "Get-GPResultantSetOfPolicy"
  },
  {
    text: "Which of the following describes the function of Virtual Memory (pagefile.sys) in the Microsoft Windows architecture?",
    options: ["It extends physical RAM by writing temporary data blocks on the hard storage drive.", "It stores the cached hardware device drivers dynamically.", "It serves as the system's UEFI boot loader container.", "It holds encrypted user passwords for faster offline authentication."],
    answer: "It extends physical RAM by writing temporary data blocks on the hard storage drive."
  },
  {
    text: "What security boundary is crossed when a user approves a User Account Control (UAC) prompt in Windows?",
    options: ["A standard user token is elevated to an administrator security token.", "The operating system switches from UEFI to Legacy BIOS compatibility.", "The local user is migrated to an Azure Active Directory domain account.", "BitLocker encryption is temporarily paused for driver signing."],
    answer: "A standard user token is elevated to an administrator security token."
  },
  {
    text: "Which command line utility scans the integrity of all protected system files and replaces corrupted versions with cached copies?",
    options: ["sfc /scannow", "chkdsk /f", "gpupdate /force", "ipconfig /flushdns"],
    answer: "sfc /scannow"
  },
  {
    text: "What is the primary visual and technical difference between the NTFS file system and the FAT32 file system?",
    options: ["NTFS supports file-level security permissions (ACLs), file encryption, and files larger than 4GB.", "NTFS does not support dynamic volume sizing or compression.", "FAT32 is more efficient on drives above 2TB in size.", "NTFS can only operate on solid-state drives and disables UEFI boot capabilities."],
    answer: "NTFS supports file-level security permissions (ACLs), file encryption, and files larger than 4GB."
  },
  {
    text: "In the Windows Event Viewer, which log category is primarily used to track user logon attempts, policy changes, and file access audits?",
    options: ["Security", "System", "Application", "Setup"],
    answer: "Security"
  },
  {
    text: "Which command would you use in Windows Command Prompt to trace the exact route and measure latency of packets sent across an IP network to a destination host?",
    options: ["tracert", "ping", "nslookup", "route print"],
    answer: "tracert"
  },
  {
    text: "What is the function of the 'gpupdate /force' command in a Windows Active Directory domain environment?",
    options: ["It immediately pulls and reapplies all current Group Policy changes from the Domain Controller.", "It triggers a force restart to install pending security updates.", "It compresses the Active Directory metadata file on the client system.", "It forces the local computer to join a specified workgroup domain."],
    answer: "It immediately pulls and reapplies all current Group Policy changes from the Domain Controller."
  },
  {
    text: "Which Windows registry hive contains specific configuration data related to the currently logged-in user profile, such as color schemes or custom software settings?",
    options: ["HKEY_CURRENT_USER", "HKEY_LOCAL_MACHINE", "HKEY_CLASSES_ROOT", "HKEY_USERS"],
    answer: "HKEY_CURRENT_USER"
  }
];

function generateQuestionsForSubject(subject: string) {
  const questions = [];
  let baseArray = EXCEL_BASE;
  if (subject === 'MICROSOFT WORD') baseArray = WORD_BASE;
  if (subject === 'POWERPOINT') baseArray = POWERPOINT_BASE;
  if (subject === 'WINDOWS OPERATION') baseArray = WINDOWS_BASE;

  const scenarios = [
    "Academic Registry System Audit",
    "Enterprise Financial Model Simulation",
    "Postgraduate Examination Case Study",
    "Advanced Information Systems Administration",
    "Higher Education Registrar Evaluation",
    "International Scientific Research Hub",
    "Engineering Operations Planning Review",
    "Strategic Organizational Logistics Task",
    "National Database Standards Assessment",
    "Higher Technical Institute Specialization"
  ];

  for (let i = 0; i < Q_PER_SUBJECT; i++) {
    const base = baseArray[i % baseArray.length];

    // Simply the actual question text - no prefixes, no attachments
    const questionText = base.text;

    questions.push({
      subject: subject,
      question_type: 'mcq',
      question_text: questionText,
      options: base.options,
      correct_answer: base.answer,
      points: 2, // 2 Points for higher standard questions
      difficulty: 'Professional', // Every question is professional higher college standard
      created_at: new Date().toISOString()
    });
  }

  return questions;
}

export async function seedQuestionsDB() {
  try {
    const collRef = collection(db, 'questions');
    // First, check if we already have questions to avoid duplicating 600 questions
    const snap = await getDocs(collRef);
    
    // Check if the current database contains old/simple 'Beginner' questions OR contains the scenarios we want to remove OR contains deprecated 'ACCESS' subject
    let needsReseed = false;
    const hasBeginner = snap.size > 0 ? snap.docs.some(d => d.data().difficulty === 'Beginner') : false;
    const hasScenario = snap.size > 0 ? snap.docs.some(d => d.data().question_text && d.data().question_text.startsWith('[')) : false;
    const hasAccess = snap.size > 0 ? snap.docs.some(d => d.data().subject === 'ACCESS') : false;
    
    if (snap.size < 600 || hasBeginner || hasScenario || hasAccess) {
        needsReseed = true;
    } 

    if (!needsReseed && snap.size >= 600) {
       return { success: true, message: 'Database already seeded with standard professional questions.' };
    } 

    if (snap.size > 0) {
       // Delete existing documents first
       const deleteBatches = [];
       let dBatch = writeBatch(db);
       let dCount = 0;
       snap.docs.forEach(d => {
            dBatch.delete(d.ref);
            dCount++;
            if (dCount === 400) {
                deleteBatches.push(dBatch);
                dBatch = writeBatch(db);
                dCount = 0;
            }
       });
       if (dCount > 0) deleteBatches.push(dBatch);
       for (const b of deleteBatches) await b.commit();
    }

    let allQuestions: any[] = [];
    SUBJECTS.forEach(sub => {
       allQuestions = allQuestions.concat(generateQuestionsForSubject(sub));
    });

    // Firestore batch writes are limited to 500 operations. We have 600 questions.
    // So we need multiple batches.
    const batches = [];
    let currentBatch = writeBatch(db);
    let opCount = 0;

    for (const q of allQuestions) {
       const newDocRef = doc(collRef);
       currentBatch.set(newDocRef, q);
       opCount++;
       if (opCount === 400) {
           batches.push(currentBatch);
           currentBatch = writeBatch(db);
           opCount = 0;
       }
    }
    
    if (opCount > 0) {
        batches.push(currentBatch);
    }

    for (const b of batches) {
        await b.commit();
    }

    return { success: true, message: `Successfully seeded ${allQuestions.length} standard professional-grade questions.` };

  } catch (error: any) {
    console.error("Error seeding:", error);
    return { success: false, message: error.message };
  }
}
