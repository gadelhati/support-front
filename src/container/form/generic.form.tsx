import { useState, ChangeEvent, useEffect, useTransition } from 'react'
import { isValidToken } from '../../service/service.token'
import { ErrorMessage } from '../../assets/error/errorMessage'
import { initialErrorMessage } from '../../assets/error/errorMessage.initial'
import { create, update, remove, retrieve, removeComposite } from '../../service/service.crud'
import { Container } from './generic.field'
import { AtributeSet } from './generic.atribute'
import { Atribute } from '../../component/atribute/atribute.interface'
import { Table } from '../template/table'
import { Button, ButtonPage, GroupButton } from '../template/button'
import { Pageable } from '../../component/pageable/pageable.interface'
import { initialPageable } from '../../component/pageable/pageable.initial'
import { ErrorBoundary } from 'react-error-boundary'
import { Modal } from '../template/modal'
import { Toast } from '../toast/toast'
import { createToast, toastDetails } from '../toast/toast.message'
// import { SubAtributeSet } from '../../component/atribute/subAtribute'
import { Header, TitleHeader } from '../template/header'
// import { Load } from '../template/load'
import { UriScreenFormat } from '../../service/uri.format'
// import { ShineButton } from './shine.button'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { PDFDocument } from '../../component/pdf/PDFDocument'
import { Input } from './input/Input'
import { InputInterface } from './input/assets/input.interface'

export const GenericForm = <T extends { id: string, name: string }>(object: any) => {
    const [state, setState] = useState<any>(object.object)
    const [states, setStates] = useState<T[]>([object.object])
    // const [subStates, setSubStates] = useState<Object[][]>(SubAtributeSet(state))
    const [error, setError] = useState<ErrorMessage[]>([initialErrorMessage])
    const [atribute, setAtribute] = useState<Atribute[]>(AtributeSet(object.object))
    const [page, setPage] = useState<number>(0)
    const [size, setSize] = useState<number>(5)
    const [pageable, setPageable] = useState<Pageable>(initialPageable)
    const [ispending, startTransition] = useTransition()
    const [modal, setModal] = useState<boolean>(false)
    const [key, setKey] = useState<string>('')
    const [search, setSearch] = useState<string>('')
    // const [data, setData] = useState('')

    useEffect(() => {
        {JSON.stringify(ispending)}
        setAtribute(AtributeSet(object.object))
        retrieveItem()
    }, [page, size])
    useEffect(()=>{
        searchValue()
    }, [key, search])
    const searchValue = async() => {
        await retrieve(object.url, page, size, key, search).then((data: any) => {
            startTransition(() => setPageable(data))
            startTransition(() => setStates(data.content))
        }).catch(() => { networkError() })
    }
    const searchKey = (ikey: string) => {
        setKey(ikey)
    }
    const searchItem = async (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
    }
    const resetItem = () => {
        // loadSubStates()
        setState(object.object)
        setError([initialErrorMessage])
    }
    const selectItem = async (data: any) => {
        // loadSubStates()
        setState(data)
        handleModal()
    }
    const validItem = (data: any) => {
        if (data?.id || data?.ii && data?.iii || data?.ddddddd) {
            handleModal()
            retrieveItem()
            createToast(toastDetails[0])
        } else {
            startTransition(() => setError(data))
            createToast(toastDetails[1])
        }
    }
    const networkError = () => {
        setError([{ field: 'DTO', message: 'Network Error' }])
    }
    const createItem = async () => {
        await create(object.url, state).then((data) => {
            validItem(data)
        }).catch(() => { networkError() })
    }
    const retrieveItem = async () => {
        await retrieve(object.url, page, size, key, search).then((data: any) => {
            startTransition(() => setPageable(data))
            startTransition(() => setStates(data.content))
        }).catch(() => { networkError() })
    }
    // const loadSubStates = async () => {
    //     Object.entries(state).map(([key, value], index) => {
    //         return (
    //             !(atribute[index]?.type === 'checkbox' || atribute[index]?.type === 'date' || value === null && atribute[index].worth === 0 || value === null && atribute[index].worth === '' || atribute[index]?.type !== 'undefined' && !Array.isArray(atribute[index]?.worth)) &&
    //             retrieve(key, 0, 1000, '', '').then((data: any) => {
    //                 startTransition(() => {
    //                     subStates[index] = data.content
    //                     setSubStates(subStates)
    //                 })
    //             }).catch(() => { networkError() })
    //         )
    //     })
    // }
    const updateItem = async () => {
        await update(object.url, state).then((data) => {
            validItem(data)
        }).catch(() => { networkError() })
    }
    const deleteItem = async () => {
        if(state.id !== undefined){
            await remove(object.url, state.id).then((data) => {
                validItem(data)
            }).catch(() => { networkError() })
        } else {
            await removeComposite(object.url, state?.dateObservation, state?.ddddddd, state?.ii, state?.iii).then((data) => {
                validItem(data)
            }).catch(() => { networkError() })
        }
    }
    // const validation = (name: string): string[] => {
    //     let vector: string[] = []
    //     if(Array.isArray(error)){
    //         error?.map((element: any) => { if (name == element.field) return vector.push(element?.message+'. ') })
    //     }
    //     return vector
    // }
    const validationDTO = (): string[] => {
        let vector: string[] = []
        if(Array.isArray(error)){
            error?.map((element: any) => { if (element.field?.startsWith("DTO")) return vector.push(element?.message+'. ') })
        }
        return vector
    }
    const handleInputChangeFather = (object: InputInterface) => {
        setState({ ...state, [object.name]: object.value })
        console.log('pai', 'name: ', object.name, ', value: ', object.value)
    }
    // const handleInputChangeSubSelect = async (event: ChangeEvent<HTMLSelectElement>) => {
    //     await retrieve(event.target.name, page, size, event.target.name, event.target.value).then((data: any) => {
    //         setState({ ...state, [event.target.name]: data?.content[0] })
    //     }).catch(() => { networkError() })
    // }
    // const handleInputChangeSubSelectArray = async (event: ChangeEvent<HTMLSelectElement>) => {
    //     await retrieve(event.target.name, 0, size, 'id', event.target.value).then((data: any) => {
    //         setState({ ...state, [event.target.name]: [data?.content[0]] })
    //     }).catch(() => { networkError() })
    // }
    const handlePage = (page: number) => {
        setPage(page)
    }
    const handleSize = (event: ChangeEvent<HTMLSelectElement>) => {
        setSize(Number(event.target.value))
    }
    const handleModal = () => {
        setModal(!modal)
        setError([initialErrorMessage])
    }
    const newItem = () => {
        setModal(!modal)
        resetItem()
        // loadSubStates()
    }
    // const removeTimeFromDate = (date: any) => {
    //     let aux = new Date(date)
    //     return new Date(aux.getFullYear(), aux.getMonth() + 1, aux.getDate()).toLocaleDateString('fr-CA');
    // }
    const showObject = (values: any): any => {
        return (
            Object.entries(values).map(([key, value]: any, index) => {
                if (key !== 'id' && key !== 'password' && index < 7 && key !== 'role') {
                    return (<td key={Math.random()}>
                        {Array.isArray(value) ?
                            <>
                                {value.map((key) => {
                                    return (
                                        typeof value === 'object' ?
                                            <>{showObject(key)}</>
                                            :
                                            <>{value}</>
                                    )
                                })}
                            </> :
                            typeof value === 'object' ?
                                <>{value == null ? '' : value?.name ? value.name : value.id}</>
                                :
                                <>{value}</>
                        }
                    </td>)
                }
            }))
    }
    // const shine = (event: React.MouseEvent<HTMLButtonElement>):void => {
    //     const button = document.querySelector(".shiny") as HTMLInputElement | null
    //     button?.style.setProperty("--x", event.clientX - button?.getBoundingClientRect().x)
    //     button?.style.setProperty("--y", event.clientY - button?.getBoundingClientRect().y)
    // }
    // const childToParent = (childdata: any) => {
    //     setData(childdata);
    // }
    return (
        <>
            {/* <ShineButton onMouseMove={shine} className='shiny'>Shine Button</ShineButton> */}
            {isValidToken() &&
                <>
                    <Modal show={modal} large={object.url.includes('istoric') || object.url.includes('weather') ? true : false}>
                        <article>
                            <header><span onClick={handleModal}>&times;</span><h2>{UriScreenFormat(object.url)}</h2></header>
                            {atribute &&
                                <>
                                    <Container key={Math.random()}>
                                        {Object.entries(state).map(([key, value]: any, index) => {
                                            return (
                                                // <p  key={Math.random()}></p>
                                                <Input childToParent={handleInputChangeFather} key={Math.random()} type={atribute[index]?.type} name={key} value={value} readOnly={false} show={modal}></Input>
                                                // <div style={atribute[index]?.type === 'hidden' ? { display: 'none' } : { display: 'flex' }}>
                                                //         <ContainerInput error={validation(key).length !== 0 ? true : false} historic={object.url.includes('istoric') || object.url.includes('weather') ? true : false}>
                                                //             <span>
                                                //                 {Array.isArray(atribute[index]?.worth) ?
                                                //                     atribute[index]?.type === 'checkbox' || atribute[index]?.type === 'date' || value === null && atribute[index]?.worth === 0 || value === null && atribute[index]?.worth === '' || value !== null && typeof value !== 'object' ?
                                                //                         <>
                                                //                             <input type={atribute[index]?.type} name={key} required value={atribute[index]?.type === 'date' ? removeTimeFromDate(value) : value} onChange={handleInputChange} autoComplete='off' readOnly={object.url.includes('istoric') ? true : false} />
                                                //                             <label htmlFor={key} hidden={atribute[index]?.type === 'hidden' || atribute[index]?.type === 'checkbox' ? true : false} >{key}</label>
                                                //                             <label htmlFor={key}>{validation(key)}</label>
                                                //                         </>
                                                //                         :
                                                //                         <>
                                                //                             <select name={key} onChange={handleInputChangeSubSelectArray} defaultValue={value[0]} value={value[0]}>
                                                //                                 <option value={value[0]} selected>{value === null ? '' : value[0]?.name ? value[0].name : value[0].id}</option>
                                                //                                 {subStates[index]?.map(((result: any) => <option placeholder={key} value={result.id}>{result?.name ? result.name : result.id}</option>))}
                                                //                             </select>
                                                //                             <label className='label' htmlFor={key} hidden={atribute[index]?.type === 'hidden' ? true : false}>{key}</label>
                                                //                         </>
                                                //                     :
                                                //                     atribute[index]?.type === 'checkbox' || atribute[index]?.type === 'date' || value === null && atribute[index]?.worth === 0 || value === null && atribute[index]?.worth === '' || atribute[index]?.type !== 'undefined' ?
                                                //                         <>
                                                //                             <input type={atribute[index]?.type} name={key} required value={atribute[index]?.type === 'date' ? removeTimeFromDate(value) : value} onChange={handleInputChange} autoComplete='off' readOnly={object.url.includes('istoric') ? true : false} />
                                                //                             <label htmlFor={key} hidden={atribute[index]?.type === 'hidden' || atribute[index]?.type === 'checkbox' ? true : false} >{key}</label>
                                                //                             <label htmlFor={key}>{validation(key)}</label>
                                                //                         </>
                                                //                         :
                                                //                         <>
                                                //                             <select name={key} onChange={handleInputChangeSubSelect} defaultValue={value}>
                                                //                                 <option value={value} selected>{value === null || value === undefined ? '' : value?.name ? value.name : value.id}</option>
                                                //                                 {subStates[index]?.map(((result: any) => <option placeholder={key} value={result.id}>{result?.name ? result.name : result.id}</option>))}
                                                //                             </select>
                                                //                             <label className='label' htmlFor={key} hidden={atribute[index]?.type === 'hidden' ? true : false}>{key}</label>
                                                //                             <label htmlFor={key}>{validation(key)}</label>
                                                //                         </>
                                                //                 }
                                                //             </span>
                                                //         </ContainerInput>
                                                // </div>
                                            )
                                        })}
                                    </Container>
                                    <Container>
                                        <div>{validationDTO()}</div>
                                    </Container>
                                    <Container hidden={object.url.includes('istoric') ? true : false} >
                                        {modal &&
                                        <PDFDownloadLink document={<PDFDocument object={state} />} fileName="somename.pdf">
                                                {({ loading }) => loading ? <Button category={'warning'} >Wait</Button> : <Button category={'secondary'} >Download</Button> }
                                        </PDFDownloadLink>}
                                        <Button type='reset' category={'secondary'} onClick={resetItem}>Reset</Button>
                                        <Button category={'success'} onClick={createItem} hidden={state.id !== "" && !object.url.includes('istoric') || object.url.includes('istoric') ? true : false}>Create</Button>
                                        <Button category={'warning'} onClick={updateItem} hidden={state.id === "" || object.url.includes('istoric') ? true : false}>Update</Button>
                                        <Button category={'danger'} onClick={deleteItem} hidden={state.id === "" || object.url.includes('istoric') ? true : false}>Delete</Button>
                                        <Button category={'secondary'} onClick={handleModal}>Close</Button>
                                    </Container>
                                </>
                            }
                        </article>
                    </Modal>
                    <Header>
                        <TitleHeader>
                            <h1>{UriScreenFormat(object.url)}</h1>
                                <label>Items per page   </label>
                                <select onChange={handleSize} >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    {/* <option value={15}>15</option> */}
                                </select>
                        </TitleHeader>
                        <><label>{key}</label><input name={search} onChange={searchItem} placeholder={`${key}`} value={search}></input></>
                        {!object.url.includes('istoric') && <Button onClick={newItem}>New</Button>}
                    </Header>
                    {/* {ispending && <Load></Load>} */}
                    <Table>
                        <thead>
                            <tr>
                                {Object.entries(state).map(([key]: any, index) => {
                                    if (key !== 'id' && key !== 'password' && index < 7 && key !== 'role') {
                                        if(!object.url.includes('weather') || index < 6) {
                                            return (<th key={Math.random()} onClick={()=>searchKey(key)}>{key}</th>)
                                        }
                                    }
                                })}
                            </tr>
                        </thead>
                        <ErrorBoundary fallback={<div> Something went wrong </div>} >
                            <tbody>
                                {states.map((element) => {
                                    return (
                                        <tr key={Math.random()} onClick={() => selectItem(element)}>
                                            <>{showObject(element)}</>
                                        </tr>)
                                })}
                            </tbody>
                        </ErrorBoundary>
                        <tfoot>
                            <tr>
                                <td colSpan={100}>
                                    <GroupButton>
                                        <ButtonPage onClick={() => handlePage(0)}>{'<<'}</ButtonPage>
                                        <ButtonPage onClick={() => handlePage(page - 1)} disabled={page <= 0 ? true : false}>{'<'}</ButtonPage>
                                        <ButtonPage onClick={() => handlePage(page - 1)} hidden={page <= 0 ? true : false}>{page}</ButtonPage>
                                        <ButtonPage selected={true} disabled  >{page + 1}</ButtonPage>
                                        <ButtonPage onClick={() => handlePage(page + 1)} hidden={page >= pageable.totalPages - 1 ? true : false}>{page + 2}</ButtonPage>
                                        <ButtonPage onClick={() => handlePage(page + 1)} disabled={page >= pageable.totalPages - 2 ? true : false}>{'>'}</ButtonPage>
                                        <ButtonPage onClick={() => handlePage(pageable.totalPages - 1)}>{'>>'}</ButtonPage>
                                        Total amount {pageable.totalElements}
                                    </GroupButton>
                                </td>
                            </tr>
                        </tfoot>
                    </Table>
                    <Toast className="notifications"></Toast>
                </>
            }
        </>
    )
}