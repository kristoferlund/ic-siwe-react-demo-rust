export const idlFactory = ({ IDL }) => {
  const UserProfile = IDL.Record({
    'avatar_url' : IDL.Text,
    'name' : IDL.Text,
    'address' : IDL.Text,
  });
  const GetMyProfileResponse = IDL.Variant({
    'Ok' : UserProfile,
    'Err' : IDL.Text,
  });
  const ListProfilesResponse = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Text, UserProfile)),
    'Err' : IDL.Text,
  });
  const Name = IDL.Text;
  const AvatarUrl = IDL.Text;
  const SaveMyProfileResponse = IDL.Variant({
    'Ok' : UserProfile,
    'Err' : IDL.Text,
  });
  return IDL.Service({
    'get_my_profile' : IDL.Func([], [GetMyProfileResponse], ['query']),
    'list_profiles' : IDL.Func([], [ListProfilesResponse], ['query']),
    'save_my_profile' : IDL.Func(
        [Name, AvatarUrl],
        [SaveMyProfileResponse],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
