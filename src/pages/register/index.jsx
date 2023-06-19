import { useNavigate  } from "react-router-dom";
import { MdEmail, MdLock } from 'react-icons/md'
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { api } from '../../services/api';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';


import { Container, Title, Column, TitleLogin, SubtitleLogin, CriarText, Row, Wrapper, InputRequired } from './styles';

const Register = () => {

    const navigate = useNavigate()

    const schema = Yup.object().shape({
        name: Yup.string().required("Nome é obrigatório").min(3, "O nome deve ter pelo menos 3 caracteres"),
        email: Yup.string().email('E-mail inválido').required("E-mail é obrigatório"),
        senha: Yup.string().required("Senha é obrigatório").min(8, "A senha deve ter pelo menos 8 caracteres")
    });
    

    const { control, handleSubmit, formState: { errors } } = useForm({
        reValidateMode: 'onChange',
        mode: 'onChange',
        defaultValues: {
            name: "",
            email: "",
            senha: ""
        },
        resolver: yupResolver(schema),
    });

    const handleLogin = () =>{
        navigate('/login')
    }

    const onSubmit = async (formData) => {
        try{
            const {data} = await api.get(`/users?email=${formData.email}`);
            
            if(data.length){
                alert('Conta já existente com este email');
                return
            }

            await api.post('/users', formData);
            alert('Conta criada com sucesso!');
            navigate('/feed');
        }catch(e){
            console.error(e);
            alert('Ocorreu um erro ao criar a conta');
        }
    };

    console.log('errors', errors);

    return (<>
        <Header />
        <Container>
            <Column>
                <Title>A plataforma para você aprender com experts, dominar as principais tecnologias
                 e entrar mais rápido nas empresas mais desejadas.</Title>
            </Column>
            <Column>
                <Wrapper>
                <TitleLogin>Comece agora grátis</TitleLogin>
                <SubtitleLogin>Crie sua conta e make the change._</SubtitleLogin>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input placeholder="Nome completo" leftIcon={<MdEmail />} name="name"  control={control} />
                    {errors.name && <InputRequired>{errors.name.message}</InputRequired>}
                    <Input placeholder="E-mail" leftIcon={<MdEmail />} name="email"  control={control} />
                    {errors.email && <InputRequired>{errors.email.message}</InputRequired>}
                    <Input type="password" placeholder="Senha" leftIcon={<MdLock />}  name="senha" control={control} />
                    {errors.senha && <InputRequired>{errors.senha.message}</InputRequired>}
                    <Button title="Registrar" variant="secondary" type="submit"/>
                </form>
                <Row>
                <SubtitleLogin>Ao clicar em "criar minha conta grátis", declaro que
                    aceito as Políticas de Privacidade e os Termos de Uso da DIO.</SubtitleLogin>
                </Row>
                <Row><strong >Já tenho conta.</strong><CriarText onClick={handleLogin}>Fazer login</CriarText></Row>
                </Wrapper>
            </Column>
        </Container>
    </>)
}

export { Register }