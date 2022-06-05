![](https://img.shields.io/badge/version-1.0.0-informational)

# RememberMeToMovie
Este é um projeto web de estudos para salvar filmes com base em interesse (gostou, não gostou, etc.) com banco de dados do Firebase (Firestore) e **JavaScipt puro**.

## Inicialização
Para começar, é necessário criar um novo projeto no [Firebase](https://firebase.google.com/docs/web/setup#add-sdk-and-initialize) e registrar um novo aplicativo. 

1. Após isso, você terá acesso as configurações do seu projeto que é o `firebaseConfig`.
2. Tendo as configurações do seu projeto, crie um arquivo `auth.js` dentro da pasta `RememberMeToMovie/js`.
3. Importe as seguintes configurações para o arquivo criado:

```js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js"
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js"
import { getStorage, ref } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-storage.js"

const firebaseConfig = {
  [...]
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const storage = getStorage(app)
```
Caso tenha dúvidas, confire a documentação do [Firebase](https://firebase.google.com/docs/guides).

***

### Licença
A licença para este projeto está sob: [GPL 3.0](./LICENSE)
