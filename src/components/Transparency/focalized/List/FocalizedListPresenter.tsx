
import { Pagination } from "flowbite-react";
import TransparencyFocusEntity from "../../../../domain/entities/TransparencyFocus";

import Numeral from "../../../Common/Numeral";

interface Props {

  data: TransparencyFocusEntity[]
  error: string | null
  onSearch: (search: string) => void
  onAdd: () => void
  onImport: () => void
  onFilter: () => void
  onEdit: (transparency: TransparencyFocusEntity) => void
  search: string
  setSeach: (search: string) => void
  page: number
  setPage: (page: number) => void
  setVisibleModal: (visible: boolean) => void
  visibleModal: boolean
  onConfirmDelete: () => void
  onCancelDelete: () => void
  onDelete: (TransparencyFocus: TransparencyFocusEntity) => void
  from: number
  to: number
  total: number
  totalPage: number,
  selectedItem: TransparencyFocusEntity | null,
  type_alert: "success" | "warning" | "info" | "error"

}
const FocalizedListPresenter = (props: Props) => {

  return(
    <>
      <h2 className='mb-4 text-balance border-b border-gray-300 pb-1 text-2xl font-bold text-primary'>
        Transparencia Focalizada
      </h2>
      <h2 className='mb-4 mt-8 hidden rounded-md bg-primary p-4 text-left text-xl font-bold text-white' />
      <section className='flex flex-col items-center justify-center gap-4'>
         <Numeral
            title={"Transparencia Focalizada"}
            text={""}
            onClick={() => props.onAdd()}
            isPublished={false}
          />
        
        {
          props.data.map(transparency => (
            <Numeral
              title={"Transparencia Focalizada"}
              text={new Date(transparency.published_at).toLocaleString()}
              onClick={() => props.onEdit(transparency)}
              isPublished={transparency.published}
            />
          ))
        }
        <Pagination
          currentPage={props.page || 1}
          totalPages={props.totalPage}
          onPageChange={props.setPage || (() => { })}
          nextLabel="Siguiente"
          previousLabel="Anterior"
          className="bg-transparent"

        />
      </section>
    </>
  )
  /*return (

    <div className="h-full">
      <div className="border-gray-300 py-5 border-b  ">
        <h2 className="text-2xl font-semibold text-black ml-11">
          Transparencia LOTAIP - Transparencia focalizada
        </h2>
      </div>

      <div className="flex items-center py-5 justify-center">

        <Modal_
          isvisible={props.visibleModal}
          onClose={() => { }}
        >
          {
            props.error && <Alert type={props.type_alert} message={props.error} onClose={() => { }} />
          }


          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {`¿Desea Eliminar la publicacion de la fecha ${props.selectedItem?.published_at && new Date(props.selectedItem?.published_at).toLocaleString()}?`}
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={() => props.onConfirmDelete()}>
              {"Si, Estoy seguro"}
            </Button>
            <Button color="gray" onClick={() => props.onCancelDelete()}>
              No, Cancelar
            </Button>
          </div>
        </Modal_>
      </div>
      <div className="mr-40 mt-5 flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-5 flex-shrink-0 ">



        <TextInput
          icon={CiSearch}
          id="buscar"
          type="date"
          placeholder="Buscar por datos"
          className="w-[190px] mt-0  border-black text-center  bg-gray-100 rounded-full "
          tabIndex={7}
          sizing="base"
        />

        


        <Button
          onClick={props.onAdd}
          type="submit"
          className="flex items-center justify-center w-1/2 h-10 px-0 text-sm tracking-wide 
                            text-white transition-colors duration-200 bg-sky-900 hover:bg-sky-700 rounded-lg shrink-0 sm:w-auto gap-x-2 ">
          <IoBagAddOutline size={25} className=" mr-2" />
          <span className="text-base">
            Agregar
          </span>
        </Button>

      </div>

      <div className="">
        <Table<TransparencyFocusEntity>
          show={true}
          columns={[
            {
              render: (row: TransparencyFocusEntity) => <p>{new Date(row.published_at).toLocaleString()}</p>,


              title: "Fecha",
            },

            {
              render: (item) => (
                <p>
                  <button
                    onClick={() => {
                      props.onEdit(item)
                    }}
                    className=" p-5 text-lg text-slate-400 font-bold rounded-full">
                    <FiEdit2 />
                  </button>

                  {/*<button
                    onClick={() => {
                    }}
                    className=" p-5 text-slate-400font-bold ">
                    <GrView />
                  </button>
                  <button
                    onClick={() => {
                      props.onDelete(item)
                    }}
                    className=" p-5 text-slate-400 font-bold ">
                    <RiDeleteBinLine />
                  </button>

                </p>
              ),
              title: "Acciones"
            }
          ]}
          title={""}
          onFilter={() => { }}
          data={props.data}
          description="No hay datos"
          length={props.data.length}
          currentPage={props.page}
          from={props.from}
          search={props.search}
          isImport={false}
          onChangePage={props.setPage}
          onImport={props.onImport}
          textImport="Importar"
          totalPages={props.totalPage}



        />
      </div>
    </div>



  )*/
}

export default FocalizedListPresenter;