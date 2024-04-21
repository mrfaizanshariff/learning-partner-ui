import { Observable, Subject } from 'rxjs';

const notifyNodeSelection = new Subject;
export const setNodeSelection = (val)=>{
    notifyNodeSelection.next(val);
}

export const nodeSelectionObservable = (cb)=>{
    const subscription = notifyNodeSelection.subscribe(cb);
    return ()=>{
        subscription.unsubscribe();
    }
}