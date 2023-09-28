import { collection, doc, getDocs } from 'firebase/firestore';
import { firestore } from '../database/firebase';

export default class UserDataBase {
  constructor(uid) {
    this.uid = uid;
  }

  async getProfile() {

    // ถ้าไม่มีข้อมูลใน Session Storage ให้ดึงข้อมูลใน Firestore
    const userDocRef = doc(firestore, 'users', this.uid);
    const profilesCollectionRef = collection(userDocRef, 'profiles');

    try {
      const querySnapshot = await getDocs(profilesCollectionRef);
      const userProfileData = [];

      querySnapshot.forEach((doc) => {
        userProfileData.push(doc.data());
      });

      // บันทึกข้อมูลใน Session Storage เพื่อใช้ในครั้งถัดไป
      sessionStorage.setItem('userProfile', JSON.stringify(userProfileData));

      return userProfileData;
    } catch (error) {
      throw error;
    }
  }
}
