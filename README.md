# TP 5 - Aplicación de gestión de archivos

La aplicación debe permitir subir archivos a un bucket y luego realizar consultas a una base de datos sobre los archivos subidos. El objetivo es codificar el **backend** de la aplicación.

## Componentes y servicios a utilizar

OpenFaas  
MongoDB  
Minio  
Docker y Kubernetes  
Algolia (opcional)  

## Funcionalidades

A partir de la subida de un archivo, la aplicación debe realizar una serie de procesamientos para obtener sus metadatos. El procesamiento depende del tipo de archivo subido, identificable por la extensión en su nombre.

Estos metadatos deben guardarse en una base de datos MongoDB, de manera que puedan realizarse consultas.

A continuación se especifican los metadatos a extraer por cada tipo de archivo.

### JPG

- Información EXIF
- Ancho y alto

Ver por ejemplo: https://github.com/gomfunkel/node-exif

### PNG

- Ancho y alto

### PDF

- Número de páginas
- Metadatos/info de cabecera
- Texto (para Algolia)

Ver por ejemplo: https://gitlab.com/autokent/pdf-parse

### TXT

- Texto (para Algolia)

### Todos los archivos

- Nombre
- Fecha de creacion
- Tamaño en bytes
- Tipo (puede ser la extensión)

## Recursos a implementar en API

- GET /file  
Devuelve todos los archivos ordenados por nombre
- GET /file/{key}  
Devuelve un archivo por su key en el bucket
- GET /file?type={ext}  
Devuelve los archivos del tipo o extension especificados
- GET /file?name={name}  
Devuelve los archivos cuyo nombre contenga el texto especificado
- GET /file?from={timestamp}&to={timestamp}  
Devuelve los archivos cuya fecha de creacion este entre los timestamps especificados
- GET /image?size={S|M|L}  
Devuelve las imagenes filtradas por tamaño, donde S es pequeño (hasta 500px), M es mediano (hasta 1000px) y L es grande (más de 1000px).
- GET /text?q={texto}  
Devuelve los archivos TXT o PDF encontrados con una búsqueda full-text, utilizando Algolia (ver a continuación)

## Algolia (opcional)

Por cada archivo PDF o TXT, es necesario extraer el texto del cuerpo y enviarlo al API de Algolia, identificandolo por el id del archivo en la base de datos.

Luego al realizar búsquedas, Algolia retornará los ids que coinciden y el backend deberá buscar en mongo los metadatos para devolver.