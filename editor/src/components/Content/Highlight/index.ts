import highlight from './highlight';
import defaultStyle from './styles/atom-dark';
import refractor from 'refractor';
import supportedLanguages from './languages/supported-languages';

const highlighter = highlight(refractor, defaultStyle);
highlighter.supportedLanguages = supportedLanguages;

export default highlighter;
