import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '@env';

// Define color palette
const silver = '#C0C0C0';
const jade = '#00A878';
const gold = '#FFD700';
const emerald = '#50C878';
const background = '#f0f0f0'; // Light gray background

// Define API base URL
//const API_BASE_URL = 'YOUR_API_BASE_URL'; // Replace with your actual API base URL

// Strain interface
interface Strain {
  id: number;
  name: string;
  description: string;
  THC: number;
  CBD: number;
  avgRating: string;
  previewImage: string | null;
  ownerId: number;
  ownerUsername: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

// Comment interface
interface Comment {
  id: number;
  comment: string;
  stars: number;
  User: {
    id: number;
    firstName: string;
    lastName: string;
  };
  CommentImages: [{
    id: number,
    url: string
  }]
}

// Image interface
interface StrainImage {
  id: number;
  url: string;
  preview: boolean;
}

const App: React.FC = () => {
  const [strains, setStrains] = useState<Strain[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);
  const [strainDetails, setStrainDetails] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(1);
  const [isAddingStrain, setIsAddingStrain] = useState(false);
  const [newStrain, setNewStrain] = useState<any>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
    fetchStrains();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading user from AsyncStorage:", error);
    }
  };

  const saveUser = async (user: any) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user to AsyncStorage:", error);
    }
  };

  const fetchStrains = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/strains`);
      const data = await response.json();
      setStrains(data.Strains);
    } catch (error) {
      console.error("Error fetching strains:", error);
    }
  };

  const fetchStrainDetails = async (strainId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/strains/${strainId}`);
      const data = await response.json();
      setStrainDetails(data);
      fetchComments(strainId);
    } catch (error) {
      console.error("Error fetching strain details:", error);
    }
  };

  const fetchComments = async (strainId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/strains/${strainId}/comments`);
      const data = await response.json();
      setComments(data.Comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleStrainPress = (strain: Strain) => {
    setSelectedStrain(strain);
    fetchStrainDetails(strain.id);
  };

  const filteredStrains = strains.filter(strain =>
    strain.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/strains/${selectedStrain?.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: newComment, stars: newRating }),
      });

      if (response.ok) {
        setNewComment('');
        fetchComments(selectedStrain!.id);
      } else {
        console.error("Error adding comment:", response.status);
        const errorData = await response.json();
        console.error("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleAddStrain = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newStrain.name);
      formData.append('description', newStrain.description);
      formData.append('flavor', newStrain.flavor);
      formData.append('city', newStrain.city);
      formData.append('state', newStrain.state);
      formData.append('country', newStrain.country);
      formData.append('potency', newStrain.potency);
      formData.append('price', newStrain.price);
      formData.append('image', {
        uri: selectedImage,
        type: 'image/jpeg', // Or the correct mime type
        name: 'strainImage.jpg', // Or a dynamic name
      });

      const response = await fetch(`${API_BASE_URL}/api/strains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
        body: formData,
      });

      if (response.ok) {
        setNewStrain({});
        setSelectedImage(null);
        setIsAddingStrain(false);
        fetchStrains(); // Refresh the strain list
      } else {
        console.error('Error adding strain:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Error adding strain:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search Strains..."
        onChangeText={setSearchTerm}
        value={searchTerm}
      />

      {/* Strain List */}
      <FlatList
        data={filteredStrains}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.strainItem} onPress={() => handleStrainPress(item)}>
            <Image source={item.previewImage ? { uri: `${API_BASE_URL}${item.previewImage}` } : require('./assets/placeholder.png')} style={styles.strainImage} />
            <View>
              <Text style={styles.strainName}>{item.name}</Text>
              <Text>{item.THC}% THC | {item.CBD}% CBD</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />

      {/* Strain Details */}
      {selectedStrain && strainDetails && (
        <ScrollView style={styles.detailsContainer}>
          <Image source={strainDetails.StrainImages[0]?.url ? { uri: `${API_BASE_URL}${strainDetails.StrainImages[0]?.url}` } : require('./assets/placeholder.png')} style={styles.detailImage} />
          <Text style={styles.detailName}>{strainDetails.name}</Text>
          <Text>{strainDetails.description}</Text>
          <Text>THC: {strainDetails.THC}% | CBD: {strainDetails.CBD}%</Text>
          <Text>Price: ${strainDetails.price}</Text>
          <Text>Added by: {strainDetails.ownerUsername}</Text>

          {/* Comments Section */}
          <Text style={styles.commentsHeader}>Comments:</Text>
          {comments.map(comment => (
            <View key={comment.id} style={styles.commentItem}>
              <Text style={styles.commentUser}>{comment.User.firstName} {comment.User.lastName}:</Text>
              <Text>{comment.comment}</Text>
              <Text>Rating: {comment.stars} stars</Text>
              {comment.CommentImages.map(image => (
                <Image key={image.id} source={{ uri: `${API_BASE_URL}${image.url}` }} style={styles.commentImage} />
              ))}
            </View>
          ))}

          {/* Add Comment Section */}
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            onChangeText={setNewComment}
            value={newComment}
          />
          <TouchableOpacity style={styles.addCommentButton} onPress={handleAddComment}>
            <Text style={styles.addCommentButtonText}>Add Comment</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Add Strain Section */}
      {isAddingStrain && (
        <ScrollView style={styles.addStrainContainer}>
          <TextInput
            style={styles.input}
            placeholder="Strain Name"
            onChangeText={(text) => setNewStrain({ ...newStrain, name: text })}
            value={newStrain.name}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            onChangeText={(text) => setNewStrain({ ...newStrain, description: text })}
            value={newStrain.description}
          />
          <TextInput
            style={styles.input}
            placeholder="Flavor"
            onChangeText={(text) => setNewStrain({ ...newStrain, flavor: text })}
            value={newStrain.flavor}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            onChangeText={(text) => setNewStrain({ ...newStrain, city: text })}
            value={newStrain.city}
          />
          <TextInput
            style={styles.input}
            placeholder="State"
            onChangeText={(text) => setNewStrain({ ...newStrain, state: text })}
            value={newStrain.state}
          />
          <TextInput
            style={styles.input}
            placeholder="Country"
            onChangeText={(text) => setNewStrain({ ...newStrain, country: text })}
            value={newStrain.country}
          />
          <TextInput
            style={styles.input}
            placeholder="Potency"
            onChangeText={(text) => setNewStrain({ ...newStrain, potency: text })}
            value={newStrain.potency}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            onChangeText={(text) => setNewStrain({ ...newStrain, price: text })}
            value={newStrain.price}
          />
          <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
            <Text style={styles.imagePickerButtonText}>Pick an Image</Text>
          </TouchableOpacity>
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.selectedImage} />}
          <TouchableOpacity style={styles.addStrainButton} onPress={handleAddStrain}>
            <Text style={styles.addStrainButtonText}>Add Strain</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Toggle Add Strain Button */}
      <TouchableOpacity style={styles.toggleAddStrainButton} onPress={() => setIsAddingStrain(!isAddingStrain)}>
        <Text style={styles.toggleAddStrainButtonText}>{isAddingStrain ? 'Cancel' : 'Add Strain'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderColor: silver,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  strainItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  strainImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  strainName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  detailImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  detailName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  commentItem: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  commentImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginTop: 5,
  },
  commentInput: {
    height: 40,
    borderColor: silver,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  addCommentButton: {
    backgroundColor: jade,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addCommentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addStrainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: silver,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  imagePickerButton: {
    backgroundColor: emerald,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  addStrainButton: {
    backgroundColor: gold,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addStrainButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  toggleAddStrainButton: {
    backgroundColor: jade,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  toggleAddStrainButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default App;