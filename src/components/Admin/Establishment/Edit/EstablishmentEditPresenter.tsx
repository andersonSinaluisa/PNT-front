import { FormEvent } from "react";
import { LuCheck, LuX } from "react-icons/lu"
import EstablishmentEntity from "../../../../domain/entities/Establishment";
import Input from "../../../Common/Input";
import Dropzone from "../../../Common/Dropzone";
import Spinner from "../../../Common/Spinner";
import Alert from "../../../Common/Alert";
import ReactSelect, { MultiValue } from 'react-select';

import { OptionsSelectCreate } from "../../../../infrastructure/Api/Establishment/interface";
import Select from "../../../Common/Select";
import NumeralDetail from "../../../../domain/entities/NumeralDetail";



interface Props {
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
    data: EstablishmentEntity;
    setData: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onChageLogo: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    error: string;
    success: string;
    setError: (e: string) => void;
    setSuccess: (e: string) => void;
    options: OptionsSelectCreate;
    hangelChangeExtraNumeral: (e: MultiValue<{ value: string, label: string }>) => void
    numerals: NumeralDetail[];
    validateFields: (name: string) => string;

    getSelectedExtraNumeral: (extra_numerals: string) => MultiValue<{ value: string, label: string }>
}

const EstablishmentEditPresenter = (props: Props) => {

    if (!props.data.id) return (<div className="flex items-center py-5 justify-center">
        <Spinner />
    </div>)

    return (

        <div className="container mb-24">
            <div className="flex items-center py-5 justify-center">


            </div>
            <form className="flex  mt-5" onSubmit={props.handleSubmit}>
                <section className="container px-4 mx-auto">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-x-3">
                                <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                                    Actualizar  Institución {props.data.name}
                                </h2>


                            </div>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                                Llena los campos para Actualizar una institución
                            </p>
                        </div>
                        <div className="flex items-center mt-4 gap-x-3">

                            <button
                                type="button"
                                onClick={props.onCancel}
                                className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide
                                text-white transition-colors duration-200 bg-gray-400 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-primary-500 dark:hover:bg-blue-500 dark:bg-blue-600">
                                <LuX className="w-5 h-5" />
                                <span>
                                    Cancelar
                                </span>
                            </button>
                            {
                                props.loading ? <Spinner /> : <button
                                    type="submit"
                                    className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide
                                text-white transition-colors duration-200  bg-primary-400  rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-primary-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                                    <LuCheck className="w-5 h-5" />
                                    <span>
                                        Guardar
                                    </span>
                                </button>
                            }

                        </div>
                    </div>

                    <div className="mt-10">
                        {
                            props.error && <Alert message={props.error} type="error" onClose={() => props.setError('')} />
                        }
                        {
                            props.success && <Alert message={props.success} type="success" onClose={() => props.setSuccess('')} />
                        }
                        <div className="grid xl:grid-cols-1 gap-4">
                            <div className="flex  flex-col m-2">
                                <Input type={"text"}
                                    placeholder={"Nombre"} width="w-60"
                                    value={props.data.name || ""}
                                    name="name"
                                    onChange={(e) => props.setData(e)}
                                    color={props.validateFields('name')}

                                />
                            </div>
                            <div className="flex  flex-col m-2">
                                <Input type={"text"}
                                    placeholder={"Abreviación"} width="w-60"
                                    value={props.data.abbreviation || ""}
                                    name="abbreviation"
                                    onChange={(e) => props.setData(e)}
                                    color={props.validateFields('abbreviation')}

                                />
                            </div>
                            <div className="flex  flex-col m-2">
                                <Input type={"text"}
                                    placeholder={"RUC"} width="w-60"
                                    value={props.data.identification || ""}
                                    name="identification"
                                    onChange={(e) => props.setData(e)}
                                    color={props.validateFields('identification')}

                                />
                            </div>
                            <div className="flex  flex-col m-2">
                                <label className="text-sm font-medium text-gray-800 dark:text-white">Dirección</label>
                                <textarea
                                    placeholder={"Dirección"}
                                    value={props.data.address || ""}
                                    name="address"
                                    className={`w-full h-20 p-2 border border-gray-300 rounded-lg 
                                    focus:outline-none focus:border-blue-500 ${props.validateFields('address') === 'success' ?
                                            'border-green-500' : props.validateFields('address') === 'failure' ?
                                                'border-red-400' : ''

                                        }`}
                                    onChange={(e) => props.setData(e)}
                                    rows={1}

                                />
                            </div>
                            <div className="flex  flex-col m-2">
                                <Select
                                    placeholder="Tipo de institución"
                                    name="type_institution"
                                    value={props.data.type_institution || ""}
                                    onChange={(e) => props.setData(e)}
                                    options={[
                                        { value: "", label: "Seleccione una opción" },
                                        ...props.options.institutions.map((institution) => ({
                                            value: institution.id + "",
                                            label: institution.name
                                        }))
                                    ]}
                                    color={props.validateFields('type_institution')}

                                />
                            </div>
                            <div className="flex  flex-col m-2">
                                <Select
                                    placeholder="Función de la institución"
                                    name="function_organization"
                                    value={props.data.function_organization || ""}
                                    onChange={(e) => props.setData(e)}
                                    options={[

                                        { value: "", label: "Seleccione una opción" },
                                        ...props.options.functions.map((func) => ({
                                            value: func.id + "",
                                            label: func.name
                                        }))
                                    ]}
                                    color={props.validateFields('function_organization')}

                                />
                            </div>
                            <div className="flex  flex-col m-2">
                                <Select
                                    placeholder="Tipo de organización"
                                    name="type_organization"
                                    value={props.data.type_organization || ""}
                                    onChange={(e) => props.setData(e)}
                                    options={[
                                        { value: "", label: "Seleccione una opción" },
                                        ...props.options.organizations.map((type) => ({
                                            value: type.id + "",
                                            label: type.name
                                        }))
                                    ]}
                                    color={props.validateFields('type_organization')}

                                />
                            </div>
                            <div className="flex  flex-col m-2">

                                <Dropzone
                                    handleChageLogo={props.onChageLogo}
                                    id="logo"
                                    multiple={false}
                                    type="image"
                                    label="Logo"
                                    name="logo"
                                    accept="image/*"
                                    url={props.data.logo as string}
                                    className={`${props.validateFields('logo') == "success" ?
                                        "bg-green-500" :
                                        props.validateFields('logo') == "failure" ?
                                            "bg-red-200" : "bg-white"
                                        }`}
                                />
                            </div>
                            <div className="flex  flex-col m-2">
                                <Input type={"text"}
                                    placeholder={"Título de la autoridad superior"} width="w-60"
                                    value={props.data.highest_authority || ""}
                                    name="highest_authority"
                                    onChange={(e) => props.setData(e)}
                                    color={props.validateFields('highest_authority')}

                                />
                            </div>
                            <div className="flex  flex-col m-2">
                                <Input type={"text"}
                                    placeholder={"Nombre de la autoridad superior"} width="w-60"
                                    value={props.data.first_name_authority || ""}
                                    name="first_name_authority"
                                    onChange={(e) => props.setData(e)}
                                    color={props.validateFields('first_name_authority')}

                                />
                            </div>
                            <div className="flex  flex-col m-2">
                                <Input type={"text"}
                                    placeholder={"Apellido de la autoridad superior"} width="w-60"
                                    value={props.data.last_name_authority || ""}
                                    name="last_name_authority"
                                    onChange={(e) => props.setData(e)}
                                    color={props.validateFields('last_name_authority')}

                                />
                            </div>

                            <div className="flex  flex-col m-2">
                                <Input type={"text"}
                                    placeholder={"Cargo de la autoridad superior"} width="w-60"
                                    value={props.data.job_authority || ""}
                                    name="job_authority"
                                    onChange={(e) => props.setData(e)}
                                    color={props.validateFields('job_authority')}


                                />
                            </div>

                            <div className="flex  flex-col m-2">
                                <Input type={"text"}
                                    placeholder={"Correo de la autoridad superior"} width="w-60"
                                    value={props.data.email_authority || ""}
                                    name="email_authority"
                                    onChange={(e) => props.setData(e)}
                                    color={props.validateFields('email_authority')}

                                />
                            </div>

                            <div className="flex  flex-col m-2">
                                <Input type={"text"}
                                    placeholder={"Título del Responsable del Comité"} width="w-60"
                                    value={props.data.highest_committe || ""}
                                    name="highest_committe"
                                    onChange={(e) => props.setData(e)}
                                    color={props.validateFields('highest_committe')}

                                />
                            </div>

                            <div className="flex  flex-col m-2">
                                <Input type={"text"}
                                    placeholder={"Nombre del Responsable del Comité "} width="w-60"
                                    value={props.data.first_name_committe || ""}
                                    name="first_name_committe"
                                    onChange={(e) => props.setData(e)}
                                    color={props.validateFields('first_name_committe')}

                                />
                            </div>
                            <div className="flex  flex-col m-2">
                                <Input type={"text"}
                                    placeholder={"Apellido del Responsable del Comité "} width="w-60"
                                    value={props.data.last_name_committe || ""}
                                    name="last_name_committe"
                                    onChange={(e) => props.setData(e)}
                                    color={props.validateFields('first_name_committe')}

                                />

                            </div>
                            <div className="flex  flex-col m-2">
                                <Input type={"text"}
                                    placeholder={"Cargo del Responsable del  Comité"} width="w-60"
                                    value={props.data.job_committe || ""}
                                    name="job_committe"
                                    onChange={(e) => props.setData(e)}
                                    color={props.validateFields('job_committe')}

                                />
                            </div>
                            <div className="flex  flex-col m-2">
                                <Input type={"text"}
                                    placeholder={"Correo del Responsable del comité"} width="w-60"
                                    value={props.data.email_committe || ""}
                                    name="email_committe"
                                    onChange={(e) => props.setData(e)}
                                    color={props.validateFields('email_committe')}

                                />

                            </div>
                            <div className="flex  flex-col m-2">
                                <Input type={"text"}
                                    placeholder={"Correo de acceso a la información"} width="w-60"
                                    value={props.data.email_accesstoinformation || ""}
                                    name="email_accesstoinformation"
                                    color={props.validateFields('email_accesstoinformation')}

                                    onChange={(e) => props.setData(e)}
                                />
                            </div>
                        </div>
                        <hr />
                        <div className="flex-col items-center justify-between mb-52">

                            <h4 className="text-lg font-medium text-gray-800 dark:text-white">
                                Obligaciones específicas
                            </h4>

                            <div className="flex items-center gap-x-3">
                                <ReactSelect
                                    placeholder="Seleccione los numerales"
                                    options={props.numerals.map((numeral) => ({
                                        value: numeral.id + "",
                                        label: numeral.name
                                    }))
                                    }
                                    className="w-full"
                                    isMulti
                                    onChange={(e) => {
                                        props.hangelChangeExtraNumeral(e)
                                    }}
                                    value={props.getSelectedExtraNumeral(props.data.extra_numerals||"")}
                                />
                            </div>
                        </div>
                    </div>

                </section>
            </form>
        </div>
    )

}

export default EstablishmentEditPresenter;