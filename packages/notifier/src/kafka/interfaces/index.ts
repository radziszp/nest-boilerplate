export interface NotifyData {
  type: 'email',
  user: {
    email: string,
  },
  data: {
    subject?: string,
    message?: string,
  },
}

export interface NotifyProvider {
  send: (data: NotifyData) => {},
}
