import {evaluateAnswer} from './rubrics.js';

// One answer-specific probe before the next prepared question. No new clinical claim is generated.
export function followupFor(question,answer){
 if(!answer.trim()||question.followup)return null;
 const result=evaluateAnswer(answer,question.rubricKey||question.title||question.kind);
 if(!result.missing.length)return null;
 const point=result.missing[0];
 const tip=result.tips[0];
 return {...question,followup:true,followupPoint:point,
  en:`You mentioned ${result.covered[0]?.toLowerCase()||'your approach'}. Please expand on ${point.toLowerCase()}. ${tip}`,
  de:`Sie haben ${result.covered[0]?.toLowerCase()||'Ihr Vorgehen'} angesprochen. Bitte erläutern Sie ${point.toLowerCase()} genauer.`,
  title:question.title?`${question.title} · follow-up`:undefined};
}
