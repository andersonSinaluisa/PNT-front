
import { useLocation, useNavigate } from "react-router-dom";
import ActiveCreatePresenter from "./ActiveCreatePresenter";
import NumeralEntity from "../../../../domain/entities/NumeralEntity";
import { useEffect, useRef, useState } from "react";
import FilePublicationUseCase from "../../../../domain/useCases/FilePublicationUseCase/FilePublicationUseCase";
import TemplateFileUseCase from "../../../../domain/useCases/TemplateFileUseCase/TemplateFileUseCase";
import TemplateFileEntity from "../../../../domain/entities/TemplateFileEntity";
import { FilePublicationEntity } from "../../../../domain/entities/PublicationEntity";
import TransparencyActiveUseCase from "../../../../domain/useCases/TransparencyActive/TransparencyActiveUseCase";
import TransparencyActive from "../../../../domain/entities/TransparencyActive";
import EstablishmentUseCase from "../../../../domain/useCases/Establishment/EstablishmentUseCase";
import EstablishmentEntity from "../../../../domain/entities/Establishment";
import NumeralUseCase from "../../../../domain/useCases/NumeralUseCase/NumeraUseCase";
import NumeralDetail from "../../../../domain/entities/NumeralDetail";
import Template from "../../../../domain/entities/Template";
import { Row } from "../../../../utils/interface";
import { Pagination } from "../../../../infrastructure/Api";
import { sleep } from "../../../../utils/functions";
import { TabsRef } from "flowbite-react";

export interface INeedProps {
  numeral: NumeralEntity,
  childs: NumeralEntity[]
  month:number;
  year:number
}

interface IProps {
  usecase: FilePublicationUseCase;
  templateUseCase: TemplateFileUseCase;
  transparencyActiveUseCase: TransparencyActiveUseCase;
  establishmentUseCase: EstablishmentUseCase;
  numeralUsecase: NumeralUseCase;

}
const ActiveCreateContainer = (props: IProps) => {


  const location = useLocation()

  const navigate = useNavigate()

  const state = location.state as INeedProps;

  const [month,setMonth] = useState(new Date().getMonth()+1)
  const [year,setYear] = useState(new Date().getFullYear())

  const [numeral, setNumeral] = useState<NumeralEntity>();
  const [detail, setDetail] = useState<NumeralDetail | null>(null)

  const [templates, setTemplates] = useState<TemplateFileEntity[]>([]);
  const [templateTable, setTemplateTable] = useState<Array<{ id: number, data: Row[][] }>>([]);

  const [filesPublication, setFilesPublication] = useState<FilePublicationEntity[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>();
  const tabsRef = useRef<TabsRef>(null);

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const [loadingFiles, setLoadingFiles] = useState<{
    name: string,
  }[]>([])

  const [establishment, setEstablishment] = useState<EstablishmentEntity>();
  const [filesList, setFilesList] = useState<Pagination<FilePublicationEntity>>({
    current: 0,
    limit: 0,
    next: 0,
    previous: 0,
    results: [],
    to: 0,
    total: 0,
    from: 0,
    total_pages: 0
  })


  useEffect(() => {
    if (state) {
      setNumeral(state.numeral)
      setMonth(state.month)
      setYear(state.year)
      setTemplates(state.numeral.templates.map((template) => {
        return new TemplateFileEntity(template.id, template.file, template.name, template.isValid, template.link)
      }))

      props.numeralUsecase.getNumeralById(state.numeral.id).then((res) => {
        setDetail(res)
        buildRowFromTemplate(res.templates)

      }).catch((e) => {
        setError(e.message)
      })
    }
  }, [])


  useEffect(() => {
    props.establishmentUseCase.getByUserSession().then((res) => {
      setEstablishment(res)
    })
  }, [])

  useEffect(() => {
    setIsDisabled(_isDisabled())
  }, [templates, filesPublication])


  useEffect(() => {
    props.usecase.getFilesPublications("TA", numeral?.id || 0).then((response) => {
      setFilesList(response)
    }).catch((error) => {
      setError(error.message)
    })
  }, [numeral])




  const handleCancel = () => {
    navigate("/admin/transparency/active")
  }


  const buildRowFromTemplate = (templates: Template[]) => {
    const data: { id: number, data: Row[][] }[] = templates.map((template) => {
      return {
        id: template.id,
        data: [
          template.columns.map((column) => {
            return {
              key: column.id.toString(),
              value: column.name,
              is_header: true,
            }
          })
        ] as Row[][]
      }

    })


    setTemplateTable(data)
  }








  const handleChageLink = async (e: React.ChangeEvent<HTMLInputElement>, templateFile: TemplateFileEntity) => {
    setLoadingFiles([...loadingFiles, { name: templateFile.name }])
    let newTemplates = templates.find((template) => {
      return template.id === templateFile.id
    })
    if (!newTemplates) return

    newTemplates.link = e.target.value

    const templateDetail = detail?.templates.find((template) => {
      return template.id === templateFile.id
    })

    if (!templateDetail) return
    const url = e.target.value

    props.usecase.getFromUrl(url).then((file) => {

      const file_ = new File([file], templateDetail.name + ".csv", {
        type: "text/csv;charset=utf-8;",
      });

      props.templateUseCase.validateLocalFile(
        file_ as File,
        templateDetail,
        true
      ).then((res) => {

        const newFile = props.usecase.csvContentFromColumsAndRows(res.columns, res.rows, templateDetail.name, templateDetail.verticalTemplate)
        setLoadingFiles(loadingFiles.filter((loading) => {
          return loading.name !== templateFile.name
        }))
        setError("")




        newTemplates = {
          ...newTemplates,
          isValid: res.valid,
          file: newFile
        } as TemplateFileEntity


        //reemplazar el template
        setTemplates(templates.map((template) => {
          if (template.id === newTemplates?.id) {
            return newTemplates
          }
          return template
        }))

        const name = newTemplates.file?.name || ""

        let filePub = filesPublication.find(x => x.description == newTemplates?.name as string)
        const index = filesPublication.indexOf(filePub as FilePublicationEntity)



        if (!filePub) {
          filePub = new FilePublicationEntity(0, name, newTemplates.name, newTemplates.file as File)
          setFilesPublication([...filesPublication, filePub])
        } else {
          filePub.url_download = newTemplates.file as File
          const newFiles = [
            ...filesPublication as FilePublicationEntity[],
          ]
          newFiles[index] = filePub
          setFilesPublication(newFiles)
        }



      }).catch((e) => {
        setError(e.message)
        setLoadingFiles(loadingFiles.filter((loading) => {
          return loading.name !== templateFile.name
        }))
        newTemplates = {
          ...newTemplates,
          isValid: false
        } as TemplateFileEntity
        sleep(2000).then(() => {
          setError("")
        })
      })
    }).catch((error) => {
      setLoadingFiles(loadingFiles.filter((loading) => {
        return loading.name !== templateFile.name
      }))
      setError(error.message)
      sleep(2000).then(() => {
        setError("")
      })
    })




  }









  const handleChanngeFile = (e: React.ChangeEvent<HTMLInputElement>, templateFile: TemplateFileEntity) => {

    if (e.target.files?.length === 0) return


    let newTemplates = templates.find((template) => {
      return template.id === templateFile.id
    })

    if (!newTemplates) {
      setError("No se ha encontrado el template")
      return;
    }
    newTemplates.file = e.target.files?.[0] as File
    if (!detail) {
      setError("No se ha encontrado el detalle del numeral")
      return;
    }
    const templateDetail = detail.templates.find((template) => {
      return template.id === templateFile.id
    })
    if (!templateDetail) return



    props.templateUseCase.validateLocalFile(
      newTemplates.file as File,
      templateDetail,
      true
    ).then((res) => {
      const newFile = props.usecase.csvContentFromColumsAndRows(res.columns, res.rows, templateDetail.name, templateDetail.verticalTemplate)

      setError("")
      newTemplates = {
        ...newTemplates,
        isValid: res.valid,
        file: newFile
      } as TemplateFileEntity


      //reemplazar el template
      setTemplates(templates.map((template) => {
        if (template.id === newTemplates?.id) {
          return newTemplates
        }
        return template
      }))



      //reemplazar el filePublication
      const name = newTemplates.file?.name || ""

      let filePub = filesPublication.find(x => x.description == newTemplates?.name as string)
      const index = filesPublication.indexOf(filePub as FilePublicationEntity)



      if (!filePub) {
        filePub = new FilePublicationEntity(0, name, newTemplates.name, newTemplates.file as File)
        setFilesPublication([...filesPublication, filePub])
      } else {
        filePub.url_download = newTemplates.file as File
        const newFiles = [
          ...filesPublication as FilePublicationEntity[],
        ]
        newFiles[index] = filePub
        setFilesPublication(newFiles)
      }


    }).catch((e) => {



      setError(e.message)
      sleep(2000).then(() => {
        setError("")
      })
    })




  }



  const uploadFile = async () => {

    setLoading(true)
    if (!filesPublication) {
      setLoading(false)
      setError("No se han subido todos los archivos")
      return
    }

    if (!_isDisabled()) {
      setLoading(false)
      setError("No se han subido todos los archivos")
      return
    }


    if (filesPublication.filter(file => file.id !== 0).length !== templates.length) {
      const promise_array = filesPublication?.map((file) => {
        return props.usecase.createFilePublication(file)
      })
      Promise.all(promise_array as Promise<FilePublicationEntity>[]).then((res) => {
        res.forEach((file, index) => {
          filesPublication[index].id = file.id
        })
      }).then(() => {
        publish().then(() => {
          setLoading(false)
          setIsDisabled(false)
          setSuccess("Se ha subido correctamente la publicación")
          setTimeout(() => {
            navigate("/admin/transparency/active")
          }, 2000)
        }).catch((e) => {
          setLoading(false)
          setError(e.message)
        })
      }).catch((e) => {
        setLoading(false)
        setError(e.message)
      })
      return;
    }



    publish().then(() => {
      setLoading(false)
      setSuccess("Se ha subido correctamente la publicación")
      setTimeout(() => {

        navigate("/admin/transparency/active")
      }, 2000)
    }).catch((e) => {
      setLoading(false)
      setError(e.message)
    })



  }

  const publish = async () => {

    if (establishment === undefined) {
      throw new Error("No se ha encontrado el establecimiento")
    }
    const newTransparency = TransparencyActive.buildForPubish(
      filesPublication,
      establishment,
      numeral?.id || 0,
      year,
      month+1
    )
    await props.transparencyActiveUseCase.publish(newTransparency)



  }


  const _isDisabled = () => {
    return templates.filter(template => template.isValid).length == templates.length && filesPublication.length === templates.length
  }


  const handleEdit = () => {
    navigate("/admin/active/previewdata")
  }

  const handleSaveDataTable = (data: Row[][], template: TemplateFileEntity) => {

    if (data.length === 0) {
      return;
    }
    const templateDetail = detail?.templates.find((_template) => {
      return _template.id === template.id
    })
    if (!templateDetail) {
      return;
    }


    let blob;
    if (templateDetail.verticalTemplate) {

      blob = props.usecase.generateContentCsvVertical(data);
      //descargar archivo
    } else {
      blob = props.usecase.generateContentCsv(data);

    }

    const csvContent = '\uFEFF' + blob; // Agregamos la marca de orden de bytes UTF-8 al inicio

    // Crear un nuevo Blob con el contenido y el tipo MIME adecuados
    const blob_ = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

    // Crear un objeto File a partir del Blob
    const file = new File([blob_], template.name + '.csv', { type: 'text/csv;charset=utf-8' });




    const copyFiles = templates.find((_template) => {
      return _template.id === template.id
    })

    if (!copyFiles) {
      setError("No se ha encontrado el template")
      return;
    }

    copyFiles.file = file

    setTemplates(templates.map((_template) => {
      if (_template.id === template.id) {
        return copyFiles
      }
      return _template
    }))




  }

  const onSaveTable = (file: File, template: TemplateFileEntity) => {

    const newTemplates = templates.find((_template) => {
      return _template.id === template.id
    })
    if (!newTemplates) {
      setError("No se ha encontrado el template")
      return;
    }
    if (!file) {
      setError("No se ha encontrado el archivo")
      return;
    }

    if (!detail) {
      setError("No se ha encontrado el detalle del numeral")
      return;
    }



    const templateDetail = detail?.templates.find((_template) => {
      return template.id === _template.id
    })
    if (!templateDetail) return

    props.templateUseCase.validateLocalFile(file, templateDetail, true).then((res) => {
      if (!res) {
        setError("El archivo no cumple con el formato")
        return
      }
      const newFile = props.usecase.csvContentFromColumsAndRows(res.columns, res.rows, templateDetail.name, templateDetail.verticalTemplate)

      newTemplates.file = newFile
      newTemplates.isValid = true
      setTemplates(templates.map((template) => {
        if (template.id === newTemplates?.id) {
          return newTemplates
        }
        return template
      }))

      let filePub = filesPublication.find(x => x.description == newTemplates?.name as string)
      const index = filesPublication.indexOf(filePub as FilePublicationEntity)



      if (!filePub) {
        filePub = new FilePublicationEntity(0, newTemplates.name, newTemplates.name, newTemplates.file as File)
        setFilesPublication([...filesPublication, filePub])
      } else {
        filePub.url_download = newTemplates.file as File
        const newFiles = [
          ...filesPublication as FilePublicationEntity[],
        ]
        newFiles[index] = filePub
        setFilesPublication(newFiles)
      }

    }).catch((e) => {
      setError(e.message)
      sleep(2000).then(() => {
        setError("")
      })
    })
  }


  const downloadTemplate = (id: number) => {

    //create csv file from template
    const data_template = templateTable.find((data) => {
      return data.id === id
    })

    const name_template = templates.find((template) => {
      return template.id === id
    })

    const template = detail?.templates.find((template) => {
      return template.id === id
    })

    const name = name_template?.name || ""



    if (!data_template) {
      setError("No se ha encontrado el template")
      return;
    }
    if (!name_template) {
      setError("No se ha encontrado el nombre del template")
      return;
    }

    if (!template) {
      setError("No se ha encontrado el template")
      return;
    }
    let content;
    if (template.verticalTemplate) {
      content = props.usecase.generateContentCsvVertical(data_template.data);
    } else {
      content = props.usecase.generateContentCsv(data_template.data);
    }

    const a = document.createElement('a')
    a.download = name + ".csv";
    a.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(content);
    a.click();



  }


  const buildRowFromTemplateAnData = (templates: Template, rows: Row[][]) => {
    let template_mod = templateTable.find((template) => {
      return template.id === templates.id
    })
    if (!template_mod) {
      template_mod = {
        id: templates.id,
        data: [
          templates.columns.map((column) => {
            return {
              key: column.id.toString(),
              value: column.name,
              is_header: true,
            }
          })
        ] as Row[][]
      }
    } else {
      template_mod.data = rows

    }

    if (
      templateTable.filter((template) => {
        return template.id === templates.id
      }).length === 0
    ) {
      setTemplateTable([...templateTable, template_mod])
    } else {
      setTemplateTable(
        templateTable.map((template) => {
          if (template.id === templates.id) {
            return template_mod !== undefined ? template_mod : template
          }
          return template
        }))
    }



  }


  const addFileFromList = (file: FilePublicationEntity) => {

    const files = filesPublication.find((file_) => {
      return file_.description.trim() === file.description.trim()
    })

    const template = templates.find((template) => {
      return template.name.trim() === file.description.trim()
    })
    if (!template) {
      setError("No se ha encontrado el template")
      return;
    }
    const temDetail = detail?.templates.find((template_) => {
      return template_.id === template.id
    })
    if (!temDetail) {
      setError("No se ha encontrado el template")
      return;
    }

    if (files) {
      setError("Ya existe un archivo de " + file.description)
      sleep(2000).then(() => {
        setError("")
      })
      return
    }
    setError("")
    fetch(file.url_download as string).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    }).then((file_) => {
      const blob = new Blob([file_], { type: 'text/csv;charset=utf-8' });
      props.templateUseCase.validateLocalFile(blob as File, temDetail, true).then((res) => {
        if (!res) {
          setError("El archivo no cumple con el formato")
          return
        }
        const columns = res.columns.map((column) => {
          return {
            key: column,
            value: column,
            is_header: true
          }
        })
        if (temDetail.verticalTemplate) {
          const rows = res.rows.map((row) => {
            return {
              key: row[0] as string,
              value: row[0] as string
            }
          })

          buildRowFromTemplateAnData(temDetail, [columns, [...rows]])
          tabsRef.current?.setActiveTab(2)
          return
        } else {
          const rows = res.rows.map((row) => {
            return row.map((value, index) => {
              return {
                key: index.toString(),
                value: value
              }
            })
          })
          buildRowFromTemplateAnData(temDetail, [columns, ...rows])
          tabsRef.current?.setActiveTab(2)
        }
      }).catch((e) => {
        setError(e.message)
      })
    }).catch((e) => {
      setError(e.message)
    })



  }
  const onRemoveFileFromPublication = (index: number) => {
    const copyFiles = [...filesPublication]
    copyFiles.splice(index, 1)
    setFilesPublication(copyFiles)
  }

  const onChangePage = (page: number) => {
    props.usecase.getFilesPublications("TA", numeral?.id || 0, page).then((response) => {
      setFilesList(response)
    }).catch((error) => {
      setError(error.message)
    })
  }
  const Download = (url: string) => {



    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'archivo.csv'
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(error => console.error('Ocurrió un error al descargar el archivo:', error));
  }

  const formatNumeral = () => {
    const format = numeral?.description
      .replace(new RegExp("_"), " ")
      .replace(new RegExp("-"), " ")


    return numeral?.name + " " + format
  }
  return (
    <ActiveCreatePresenter
      title={formatNumeral()}
      error={error || ""}
      handleSubmit={uploadFile}
      loading={loading}
      onChageFile={handleChanngeFile}
      onEdit={handleEdit}
      setData={() => { }}
      setError={setError}
      setSuccess={setSuccess}
      templates={templates}
      onChageLink={handleChageLink}
      success={success || ""}
      filesPublication={filesPublication || []}
      isDisabled={!isDisabled}
      dataTable={templateTable || []}
      numeralDetail={detail}
      onSaveTable={handleSaveDataTable}
      onGenerateFileFromTable={onSaveTable}
      downloadTemplate={downloadTemplate}
      type="Transparencia Activa"
      files_uploaded_last={filesList}
      addFileFromList={addFileFromList}
      onRemoveFileFromPublication={onRemoveFileFromPublication}
      onCancel={handleCancel}
      onChangePage={onChangePage}
      DownloadFileFromUrl={Download}
      loadingFiles={loadingFiles}
      tabRef={tabsRef}
      month={month}
      year={year}
    />
  )
}
export default ActiveCreateContainer