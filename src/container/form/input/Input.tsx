import { useState, ChangeEvent, useEffect, useTransition } from 'react'
import { ErrorMessage } from 'src/assets/error/errorMessage'
import { initialErrorMessage } from 'src/assets/error/errorMessage.initial'
import { InputInterface } from './input.interface'
import { retrieve } from 'src/service/service.crud'
import { SubAtributeSet } from 'src/component/atribute/subAtribute'
import { SetAtributes } from './setAtributes'
import { initialInput } from './input.initial'
import './input.scss'

export const Input = (object: InputInterface) => {
    const [state, setState] = useState<InputInterface>(initialInput)
    const [subStates, setSubStates] = useState<Object[]>(SubAtributeSet(state))
    const [error, setError] = useState<ErrorMessage[]>([initialErrorMessage])
    const [page, setPage] = useState<number>(0)
    const [size, setSize] = useState<number>(5)
    const [ispending, startTransition] = useTransition()

    useEffect(() => {
        setState(SetAtributes(object))
        loadSubStates()
    }, [object.show])
    const validation = (name: string): string[] => {
        let vector: string[] = []
        if(Array.isArray(error)){
            error?.map((element: any) => { if (name == element.field) return vector.push(element?.message+'. ') })
        }
        return vector
    }
    const loadSubStates = async () => {
        // !(object.type === 'checkbox' || object.type === 'date' || object.type !== 'undefined') &&
        Array.isArray(object.value) &&
            retrieve(object.name, 0, 1000, '', '').then((data: any) => {
                startTransition(() => {
                    setSubStates(data.content)
                })
            }).catch(() => { networkError() })
    }
    const removeTimeFromDate = (date: any) => {
        let aux = new Date(date)
        return new Date(aux.getFullYear(), aux.getMonth() + 1, aux.getDate()).toLocaleDateString('fr-CA');
    }
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setState({ ...state, value: value })
    }
    const handleInputChangeSubSelect = async (event: ChangeEvent<HTMLSelectElement>) => {
        await retrieve(event.target.name, page, size, event.target.name, event.target.value).then((data: any) => {
            setState({ ...state, value: data?.content[0] })
        }).catch(() => { networkError() })
    }
    const handleInputChangeSubSelectArray = async (event: ChangeEvent<HTMLSelectElement>) => {
        await retrieve(event.target.name, 0, size, 'id', event.target.value).then((data: any) => {
            setState({ ...state, value: [data?.content[0]] })
        }).catch(() => { networkError() })
    }
    const networkError = () => {
        setError([{ field: 'DTO', message: 'Network Error' }])
    }
    return (
        <span>
            {/* {state.type === 'checkbox' || state.type === 'date' || state.value === null && state.type === 'number' || state.value === null && state.type === 'string' || state.type !== 'undefined' ? */}
            { !Array.isArray(state.value) ?
                <input type={state.type} name={state.name} required defaultValue={state.type === 'date' ? removeTimeFromDate(state.value) : state.value} value={state.value} onChange={handleInputChange} autoComplete='off' readOnly={state.readOnly} />
                :
                <select name={state.name} onChange={Array.isArray(state.object)?handleInputChangeSubSelectArray:handleInputChangeSubSelect} defaultValue={state.value[0]} >
                    <option value={state.value[0]} selected>{state.value === null || state.value === undefined ? '' : state.value[0].name ? state.value[0].name : state.value[0].id}</option>
                    {subStates?.map(((result: any) => <option value={result.id}>{result?.name ? result.name : result.id}</option>))}
                </select>
            }
            <label htmlFor={state.name} hidden={state.type === 'hidden' || state.type === 'checkbox' ? true : false} >{state.name}</label>
            <label htmlFor={state.name}>{validation(state.name)}</label>
        </span>
    );
}