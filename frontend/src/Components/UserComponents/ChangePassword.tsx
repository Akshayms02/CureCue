import React from 'react';
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"

import { useChangePasswordForm } from '../../../hooks/useChangePasswordForm';
import { changePassword } from '../../services/userServices';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { toast } from 'sonner';

export const ChangePassword: React.FC = () => {
    const userData = useSelector((state: RootState) => state.user.userInfo);

    const {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        reset
    } = useChangePasswordForm();

    const onSubmit = async (data: {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string
    }) => {
        try {
            console.log("change pass clicked")
            await changePassword(data.currentPassword, data.newPassword, userData?.userId as string);
            toast.success("Your password has been updated")

            reset();
        } catch (error: any) {
            toast.warning(error.message)

        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Change Password</h3>
                <p className="text-sm text-muted-foreground">
                    Update your password to keep your account secure.
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-1/2">
                <div className="space-y-2 ">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                        id="currentPassword"
                        type="password"
                        {...register('currentPassword')}
                    />
                    {errors.currentPassword && (
                        <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                        id="newPassword"
                        type="password"
                        {...register('newPassword')}
                    />
                    {errors.newPassword && (
                        <p className="text-sm text-destructive">{errors.newPassword.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input
                        id="confirmNewPassword"
                        type="password"
                        {...register('confirmNewPassword')}
                    />
                    {errors.confirmNewPassword && (
                        <p className="text-sm text-destructive">{errors.confirmNewPassword.message}</p>
                    )}
                </div>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Changing...' : 'Change Password'}
                </Button>
            </form>
        </div>
    );
};

