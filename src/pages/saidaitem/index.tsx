import Head from 'next/head'
import { Header } from '../../components/Header'
import { canSSRAuth } from '../../utils/canSSRAuth'
import styles from './style.module.scss'
import {setupAPIClient} from '../../services/api'
import { FormEvent, useState } from 'react'
import {toast} from 'react-toastify'
import {Footer} from '../../components/ui/footer/Footer'




type ItemProps = {
  id_produto: string,
  nome_produto: string,
  quantidade: number,
  description: string
  nova_quantidade: number,
}

interface prodProps{
  produtList: ItemProps[];
}

export default function Saidaitem({produtList}:prodProps){
  console.log(produtList);

  const [nova_quantidade, setQuantidade] = useState('')

  const [produtos, setProdutos]=useState(produtList || []);
  const [prodSelected, setProdSelectd] = useState(0)
 
  function handleProduto(event){
    setProdSelectd(event.target.value)
  }

 async function pHandleRegister(event: FormEvent){
      event.preventDefault();

      const nova_quantidadeC = Number(nova_quantidade)
      try{
        if(nova_quantidade === ''){
          toast.error('Preencha o campo quantidade.')
          return;
        }

        const apiClient = setupAPIClient();

      await apiClient.put('/productsaida',{
   
       id_produto: produtos[prodSelected].id_produto,
      nova_quantidade: nova_quantidadeC

      }) 
        toast.success('Entrada registrada com sucesso!')
    }
      catch(err){
        console.log(err);
        toast.error("Erro ao acrescentar!")
      }

      setQuantidade('')
 }



    return(
        <>
            <Head>
                <title>CHAVE - Saída de Produto</title>
            </Head>
            <div>
                <Header/>


                <main className={styles.container}>
                <h1>Saída de Produto</h1>
                <form className={styles.form} onSubmit={pHandleRegister}>
                    <select value={prodSelected} onChange={handleProduto}>
                      {produtos.map((item, index)=>{
                        return(
                          <option key={item.id_produto} value={index}>
                            {item.nome_produto}
                          </option>
                        )
                      }
                      
                      
                      )}
                       
                    </select>

                    <input
                    type="number" 
                    placeholder='Digite a quantidade da nova entrada'
                    className={styles.input} value={nova_quantidade}
                    onChange={ (e) => setQuantidade(e.target.value)} />

                   <button className={styles.buttonAdd} type="submit">
                        Registrar
                   </button>

                  

                </form>





                </main>


            </div>
            <Footer/>
        </>

    )
}

export const getServerSideProps = canSSRAuth(async (ctx)=> {
  
  const apliCliente = setupAPIClient(ctx)

  const response = await apliCliente.get('/product')

  //console.log(response.data);

    return{
        props: {
          produtList: response.data
        }
    }
})

