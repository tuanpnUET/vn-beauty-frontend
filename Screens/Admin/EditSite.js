import React, { useState, useEffect } from "react"
import { 
    View, 
    Text,
    Image,
    StyleSheet,
} from "react-native"
import { Item, Picker } from "native-base"
import FormContainer from "../Form/FormContainer"
import Input from "../Form/Input"
import MyButton from "../../Shared/MyButton"
import Error from "../../Shared/Error"
import Icon from "react-native-vector-icons/FontAwesome"
import Toast from "react-native-toast-message"
import AsyncStorage from "@react-native-community/async-storage"
import baseURL from "../../assets/common/baseUrl"
import axios from "axios"

const EditSite = (props) => {

    const [pickerValue, setPickerValue] = useState();
    const [location, setLocation] = useState();
    const [name, setName] = useState();
    const [rating, setRating] = useState();
    const [description, setDescription] = useState();
    const [category, setCategory] = useState();
    const [id, setId] = useState();
    const [categories, setCategories] = useState([]);
    const [err, setError] = useState();
    const [token, setToken] = useState();


    useEffect(() => {
        // console.log(props)

        setId(props.route.params.item.id);
        setLocation(props.route.params.item.location);
        setName(props.route.params.item.name);
        setRating(props.route.params.item.rating.toString());
        setDescription(props.route.params.item.description);
        setCategory(props.route.params.item.category.id);

       
        // Get categories
        axios
        .get(`${baseURL}/categories`)
        .then((res) => {
            // console.log(res),
            setCategories(res.data)})
       
        //Get Token
        AsyncStorage.getItem("jwt")
            .then((res) => {
                setToken(res)
            })
            .catch((error) => console.log(error))

        return () => {
            setCategories([]);
            setId();
            setLocation();
            setName();
            setRating();
            setDescription();
            setCategory();
            setToken();
        }
        }, []);
        

        const editSite = () => {

            if (
                name == "" ||
                location == "" ||
                rating == "" ||
                description == "" ||
                category == "" 
            ) {
                setError("Vui l??ng ??i???n ?????y ????? c??c m???c!")
            }

          


            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

            const Site = {
                id: id,
                name: name,
                location: location,
                rating: rating,
                description: description,
                category: category,
            }

            axios
            .put(`${baseURL}/sites/${id}`, Site, config)
            .then((res) => {
                if (res.status == 200 || res.status == 201) {
                Toast.show({
                    topOffset: 60,
                    type: "success",
                    text1: "???? s???a th??ng tin.",
                    text2: "",
                });
                setTimeout(() => {
                    props.navigation.navigate("Sites");
                }, 500);
                }
            })
            .catch((error) => {
                Toast.show({
                topOffset: 60,
                type: "error",
                text1: "Opps, c?? l???i x???y ra.",
                text2: "Xin vui l??ng th??? l???i",
                });
            });   

        }


    return (  
            <FormContainer title="S???a th??ng tin">
                <View style={styles.label}>
                    <Text style={styles.title}>T??n danh lam</Text>
                </View>
                <Input 
                    placeholder="T??n danh lam"
                    name="name"
                    id="name"
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <View style={styles.label}>
                    <Text style={styles.title}>?????a ch???</Text>
                </View>
                <Input 
                    placeholder="?????a ch???"
                    name="location"
                    id="location"
                    value={location}
                    onChangeText={(text) => setLocation(text)}
                />
                    <View style={styles.label}>
                    <Text style={styles.title}>??i???m ????nh gi??</Text>
                </View>
                <Input 
                    placeholder="??i???m ????nh gi??"
                    name="rating"
                    id="rating"
                    value={rating}
                    keyboardType={"numeric"}
                    onChangeText={(text) => setRating(text)}
                />
                    <View style={styles.label}>
                    <Text style={styles.title}>M?? t???</Text>
                </View>
                <Input 
                    placeholder="M?? t???"
                    name="description"
                    id="description"
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                />
                <View style={styles.label}>
                    <Text style={styles.title}>L???a ch???n danh m???c</Text>
                </View>
                <View  style={{marginTop: 10, paddingLeft: 10, paddingRight: 20 , borderWidth: 2, borderColor: '#D6D5D5', borderRadius: 20 }}>
                <Item picker>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon color={"#007aff"} name="arrow-down" />}
                            style={{width: 250, height: 50, color: 'black'}}
                            placeholder="Ch???n danh m???c"
                            selectedValue={pickerValue}
                            onValueChange={(e) => [setPickerValue(e), setCategory(e)]}
                        >
                            {categories.map((c) => {
                                // console.log(c.name)
                                return <Picker.Item key={c.id} label={c.name} value={c.id} />
                            })}
                        </Picker>
                </Item>
                </View>
                
                {err ? <Error message={err} /> : null}
                <View style={styles.buttonContainer}>
                    <MyButton
                        large
                        primary 
                        style={{backgroundColor: '#36CBDA', 
                        borderRadius: 20}} 
                        onPress={() => editSite()}               
                    >
                        <Text style={styles.buttonText}>X??c nh???n</Text>
                    </MyButton>
                </View>
            </FormContainer>
    )
}

const styles = StyleSheet.create({
    label: {
        width: "80%",
        marginTop: 10
    },
    buttonContainer: {
        width: "80%",
        marginBottom: 80,
        marginTop: 20,
        alignItems: "center"
    },
    buttonText: {
        color: "white"
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    }
})

export default EditSite;