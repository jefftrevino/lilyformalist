sequenceDiagram
  participant atom
  participant lilyformalistUI
  participant lilyformalist.ly
  participant lilycompile
  participant pdfview
  participant lilypond

  atom->>lilyformalistUI: user installs/activates
  lilyformalistUI->>atom: queries .ly files in project
  atom->>lilyformalistUI: returns alphabetized list of .ly files
  lilyformalistUI->>atom: opens UI in display pane with box for each .ly file
  lilyformalistUI->>lilyformalist.ly: left to right box sequence written as include sequence in tmp .ly
  atom->>lilyformalistUI: user clicks/drags boxes to rearrange
  lilyformalistUI->>lilyformalistUI: boxes re-render in new positions
  lilyformalistUI->>lilyformalist.ly: .ly rewritten to tmp to rearrange include statements to reflect new box order
  lilyformalistUI-->>lilycompile: User clicks render button to pass path and trigger render of lilyformalist.ly
  lilyformalist.ly-->>lilycompile: .ly for render and display  
  lilycompile-->>lilypond: render .ly as .pdf
  lilypond-->>lilycompile: pass back rendered .pdf path
  lilycompile-->>pdfview: .pdf for display
  pdfview-->>atom: displays .pdf in new tab
