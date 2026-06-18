import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../app/axios';

export const fetchUnreadCount = createAsyncThunk('notif/count', async () => {
  const { data } = await api.get('/notifications/unread-count');
  return data.count;
});

const slice = createSlice({
  name: 'notifications',
  initialState: { unread: 0, items: [] },
  reducers: {
    setUnread(s, a) { s.unread = a.payload; },
  },
  extraReducers: (b) => {
    b.addCase(fetchUnreadCount.fulfilled, (s, a) => { s.unread = a.payload; });
  },
});

export const { setUnread } = slice.actions;
export default slice.reducer;
