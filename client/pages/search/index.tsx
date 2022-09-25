import React, {useEffect, useState} from 'react';
import {GetServerSideProps, NextPage} from "next";
import {useAppDispatch, useAppSelector, wrapper} from "../../store/store";
import {getPostsSelector} from "../../store/selectors/postsSelectors";
import Posts from "../../components/Posts/Posts";
import {
    Avatar,
    Button,
    Card,
    CardContent,
    Checkbox, Chip,
    FormControl,
    FormControlLabel,
    FormLabel, InputAdornment, List, ListItem, ListItemText, Paper,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {useRouter} from "next/router";
import {Box} from "@mui/system";
import {Controller, useForm} from "react-hook-form";
import Image from 'next/image'
import {FieldType, InputsType} from "../../types/formTypes";
import useDebounce from '../../hooks/useDebounce';
import {getUsersSelector} from "../../store/selectors/profileSelectors";
import Author from "../../components/Post/Author/Author";
import {ExtendUserType} from "../../types/users";
import {withAuth} from "../../utils/withAuth";
import {getUsers} from "../../store/thunks/profileThunks";
import {getPosts} from "../../store/thunks/postsThunks";
import notFoundImage from '../../assets/notFound.gif'
import {Api} from "../../api/api";
import Tags from "../../common/Tags/Tags";
import stringAvatar from "../../utils/stringToColor/stringToColor";
import NotFound from "../../common/NotFound/NotFound";
type FormData={
    orderBy:"popular" | "new",
    exactMatch:boolean,
    ratingFrom:number,
    ratingTo:number,
    authorName:string,
    tags:string[],
    searchBy:string
}
enum ValuesSearchBy{
    OnlyForTitle="OnlyForTitle",
OnlyForDescription="OnlyForDescription",
    ForTitleAndDescription="ForTitleAndDescription"
}
type Field=FieldType<FormData>
const Search:NextPage<{defaultUser?:ExtendUserType}> = ({defaultUser}) => {
    const router = useRouter();
    const params = router.query;
    const {handleSubmit,control,formState:{errors}}=useForm<FormData>({
        defaultValues:{
            ...params,
        }
    })
    const posts=useAppSelector(getPostsSelector);
    const [author,setAuthor]=useState<ExtendUserType | null>(defaultUser || null)
    const [tags,setTags]=useState<string[]>([])
    const [isUsersPaperClose,setIsUsersPaperClose]=useState(false);
    const [isTagPaperOpen,setIsUsersPaperOpen]=useState(false);
    const defaultValueForSearchBy=():string=>{
        const value=router.query?.searchBy
        if ((typeof value==="string") && (value.includes(ValuesSearchBy.OnlyForTitle)
            || value.includes(ValuesSearchBy.OnlyForDescription)
            || value.includes(ValuesSearchBy.ForTitleAndDescription)
        ) ){
            return value
        }
        return  ValuesSearchBy.OnlyForTitle
    }
    const defaultValueForOrderBy=():string=>{
        const value=router.query?.type
        if ((typeof value==="string" ) && ( value?.includes("popular") || value?.includes("new"))) return value
        return "popular"
    }
    const defaultValueForExactMatch=():boolean=>{
        const value=router.query?.type
        if ((typeof value=== "string") && (value?.includes("true") || value?.includes("false"))) return JSON.parse(value)
        return false
    }
    const defaultValuesForRatings=(type:"From" | "To" )=>{
        const value=router.query[`rating${type}`]
        if ((typeof value=== "string") && (+value)) return value
    }
    const fields:Field[]=[
        {
        id:1,
        name:"orderBy",
        typeOfField:InputsType.RADIO,
        subItems:["popular","new"],
            defaultValue:defaultValueForOrderBy(),
        rules:{
            required:true
        }
    },

        {
            id:4,
            name:"searchBy",
            subItems:[ValuesSearchBy.OnlyForTitle,ValuesSearchBy.OnlyForDescription,ValuesSearchBy.ForTitleAndDescription],
            defaultValue:defaultValueForSearchBy(),
            typeOfField:InputsType.RADIO,
        },
        {
            id:3,
            name:"exactMatch",
            defaultValue:defaultValueForExactMatch(),
            typeOfField:InputsType.CHECKBOX
        },
        {
            id:5,
            name:"authorName",
            typeOfField:InputsType.TEXT,
        },
        {
            id:6,
            name:"ratingFrom",
            typeOfField:InputsType.NUMBER,
            defaultValue:defaultValuesForRatings("From")
        },
        {
          id:7,
          name:"ratingTo",
          typeOfField:InputsType.NUMBER,
            defaultValue:defaultValuesForRatings("To")
        },
        {
           id:8,
           name:"tags",
           typeOfField:InputsType.TEXT
        }
    ]
    const dispatch=useAppDispatch();
    const onSubmit=async (data:FormData)=>{
        router.push({
            pathname:"/search",
            query:{
                ratingFrom:data.ratingFrom,
                ratingTo:data.ratingTo,
                query:params.query,
                type:data.orderBy,
                authorId:author?.id,
                tags:JSON.stringify(selectedTags),
                searchBy:data.searchBy,
                exactMatch:data.exactMatch
            }
        })
    }
    const setAuthorHandle=(user:ExtendUserType)=>{
        setSearchTerm("")
        setAuthor(user);
        setIsUsersPaperClose(false)
    }
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTag,setSearchTag]=useState("")
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const debouncedSearchTag=useDebounce(searchTag,500)
    const getUsersHandle=async ()=>{
        if(debouncedSearchTerm){
            setIsUsersPaperClose(true)
            setAuthor(null)
            await  dispatch(getUsers({
                isCleanUsers:true,
                fullName:searchTerm
            }))
        }
    }
    const getTagsHandle=async ()=>{
        if (debouncedSearchTag && searchTag){
            setIsUsersPaperOpen(true)
           const result=await Api().tags.getTags({tagName:searchTag})
            setTags(result.items);
        }
    }
    useEffect( ()=>{
        getTagsHandle()
    },[debouncedSearchTag])
    useEffect( ()=>{
        getUsersHandle()
    },[debouncedSearchTerm])
    useEffect(()=>{

    },[debouncedSearchTag])
    const users=useAppSelector(getUsersSelector);
    const [selectedTags,setSelectedTags]=useState<string[]>([])
    useEffect(()=>{
        const preparedTags=params?.tags
        const tags=typeof preparedTags==="string" &&  JSON.parse(preparedTags)
         if(Array.isArray(tags)) setSelectedTags(tags)
    },[])
    const onSelectedTagHandle=(tagName:string)=>{
        if (!selectedTags.find(tag=>tag===tagName))        setSelectedTags(prevState =>([...prevState,tagName]))
        setSearchTag("")
        setIsUsersPaperOpen(false);
    }
    const onDeleteTagHandle=(tagName:string)=>{
        if (selectedTags.find(tag=>tag===tagName)) setSelectedTags(prevState =>(prevState.filter(tag=>tag!==tagName)))
    }
    return (
        <Box sx={{width:"100%"}}>
            <Box
                sx={{
                    maxWidth:"600px",
                    margin:"0 auto",
                    px:4,py:1, backgroundColor:"#fff",mb:1}} >
                 <Typography variant={"h3"}>{params.query}</Typography>
                <Typography>Founded a {posts.total} items </Typography>
            </Box>
            <Stack  spacing={2} direction={"row"} justifyContent={"center"} >
                {posts.total ? <Posts posts={posts}/>:<NotFound message={"Sorry, but this option we can't find Post. Try change a options"}  />}
                <Card sx={{width:400}} variant={"outlined"} >
                    <CardContent>
                        <Typography sx={{fontWeight:"bold"}} variant={"h6"}>
                            Advanced search
                        </Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {fields.map(textField=><Box key={textField.id}><Controller
                                                               name={textField.name}
                                                               control={control}
                                                               rules={textField.rules}
                                                               defaultValue={textField.defaultValue}
                                                               render={
                                                                   ({ field }) =>{
                                                                       if (textField.typeOfField===InputsType.RADIO){
                                                                      return     <FormControl>
                                                                               <FormLabel id="demo-radio-buttons-group-label">{textField.name}</FormLabel>
                                                                               <RadioGroup
                                                                                   aria-labelledby="demo-radio-buttons-group-label"
                                                                                   defaultValue={textField.defaultValue}
                                                                                   name={textField.name}
                                                                               >
                                                                                   {textField?.subItems?.map(subItem=><FormControlLabel key={Math.random()} {...field} value={subItem}
                                                                                                                                        control={<Radio defaultChecked={subItem===textField.defaultValue} />}
                                                                                                                                       label={subItem} />)}
                                                                               </RadioGroup>
                                                                           </FormControl>
                                                                       }
                                                                       if (textField.typeOfField===InputsType.CHECKBOX){
                                                                           return <Box>
                                                                               <FormControlLabel
                                                                                   control={<Checkbox defaultChecked={!!textField.defaultValue}   />}
                                                                                   label={textField.name}
                                                                                   {...field}
                                                                               />
                                                                           </Box>
                                                                       }
                                                                       if (textField.name==="authorName"){
                                                                           return <Box sx={{position:"relative"}}>
                                                                               <TextField
                                                                                   type={textField.typeOfField}
                                                                                   helperText={errors[textField.name]?.message}
                                                                                   error={textField.name in errors}
                                                                                   margin={"normal"}  fullWidth
                                                                                   label={textField.name}  {...field}
                                                                                   value={searchTerm}
                                                                                   InputProps={{
                                                                                       readOnly:!!author,
                                                                                       startAdornment: <InputAdornment position="start">
                                                                                           {author && <Chip   onDelete={()=>setAuthor(null)}
                                                                                                              label={author.fullName}
                                                                                                              size={"medium"}
                                                                                                              avatar={author.logo ? <Avatar alt={"logo"}  src={author.logo} /> :<Avatar {...stringAvatar(author.fullName)} /> } />
                                                                                           }
                                                                                       </InputAdornment>,
                                                                                   }}
                                                                                   onChange={(e:any)=>setSearchTerm(e.target.value)} />
                                                                               { isUsersPaperClose &&  <Paper
                                                                                       sx={{position:"absolute",zIndex:"2",
                                                                                           width:"100%",height:200,overflow:"auto",p:1}}>
                                                                                       <Stack spacing={1}>
                                                                                           {users.map(user=><Box key={user.id} onClick={()=>setAuthorHandle(user)}>
                                                                                                   <Author
                                                                                                       key={user.id}
                                                                                                       withOutLink
                                                                                                       author={user}/>
                                                                                           </Box>
                                                                                           )}
                                                                                       </Stack>
                                                                                   </Paper>}
                                                                           </Box>
                                                                       }
                                                                       if (textField.name==="tags"){
                                                                           return <Box sx={{position:"relative"}}>
                                                                               <TextField
                                                                                   type={textField.typeOfField}
                                                                                   error={textField.name in errors}
                                                                                   margin={"normal"}  fullWidth
                                                                                   label={textField.name}  {...field}
                                                                                   value={searchTag}
                                                                                   multiline
                                                                                   onChange={(e:any)=>setSearchTag(e.target.value)} />
                                                                                   <Tags deleteTagHandle={onDeleteTagHandle}  tags={selectedTags}/>
                                                                               { isTagPaperOpen &&  <Paper
                                                                                   sx={{position:"absolute",zIndex:"2",
                                                                                       width:"100%",height:200,overflow:"auto",p:1}}>
                                                                                   <Stack spacing={1}>
                                                                                       <List  component="nav" aria-label="mailbox folders">
                                                                                           {tags.map(tag=><ListItem key={Math.random()} onClick={()=>onSelectedTagHandle(tag)} button>
                                                                                               <ListItemText primary={`#${tag}`}/>
                                                                                               </ListItem>
                                                                                           )}
                                                                                       </List>
                                                                                   </Stack>
                                                                               </Paper>}
                                                                           </Box>
                                                                       }
                                                                       return  <TextField
                                                                           type={textField.typeOfField}
                                                                           helperText={errors[textField.name]?.message}
                                                                           error={textField.name in errors}
                                                                           margin={"normal"}  fullWidth
                                                                           label={textField.name}  {...field} />
                                                                   }}/></Box>)}
                            <Button variant={"contained"} type={"submit"}>
                                Search
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
};
export const getServerSideProps:GetServerSideProps=withAuth(async (store,ctx)=>{
     const query=ctx.query
    const dispatch=store.dispatch;
     let params:any=Object.fromEntries(Object.entries(query).filter(arr=>!!arr[1]))
     if (Object.values(params).length){
         await dispatch(getPosts({
             ctx,
             searchDto:{
                 ...params,
             }
         }))
         if (+params?.authorId ){
             const user=await Api(ctx).profile.profile(params.authorId)
             if (user){
                 console.log('u',user);
                return {
                    props:{
                        defaultUser:user
                    }
                }
             }
         }
         return  {
             props:{

             }
         }
     }
     return {
         redirect: {
             destination: '/',
             permanent: false
         }
     }
})
export default Search;
