import {
  Button,
  Card,
  H1,
  H3,
  Paragraph,
  Separator,
  Sheet,
  Spinner,
  XStack,
  YStack
} from '@my/ui'
import { User, Instagram, Twitter } from '@tamagui/lucide-icons'
import { useState } from 'react'

interface Profile {
  id: string
  name: string
  affiliation: string
  bio: string
  instagram_id: string
  twitter_id: string
  created_at: string
}

interface ProfileDisplayProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileId?: string
}

export function ProfileDisplay({ open, onOpenChange, profileId }: ProfileDisplayProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`https://api.bridgeme.com/profiles/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('プロフィールが見つかりません')
        }
        throw new Error('プロフィールの取得に失敗しました')
      }
      
      const data = await response.json()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenProfile = async () => {
    if (profileId && open) {
      await fetchProfile(profileId)
    }
  }

  useState(() => {
    handleOpenProfile()
  }, [profileId, open])

  return (
    <Sheet
      modal
      animation="medium"
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[90]}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay
        bg="$shadow4"
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle bg="$color8" />
      <Sheet.Frame flex={1} p="$4" bg="$background">
        {loading ? (
          <YStack flex={1} justify="center" items="center" gap="$4">
            <Spinner size="large" />
            <Paragraph>プロフィールを読み込み中...</Paragraph>
          </YStack>
        ) : error ? (
          <YStack flex={1} justify="center" items="center" gap="$4">
            <Paragraph color="$red10">{error}</Paragraph>
            <Button onPress={() => profileId && fetchProfile(profileId)}>
              再試行
            </Button>
            <Button variant="outlined" onPress={() => onOpenChange(false)}>
              閉じる
            </Button>
          </YStack>
        ) : profile ? (
          <YStack gap="$6">
            <YStack items="center" gap="$4">
              <User size="$8" color="$color10" />
              <H1 text="center">{profile.name}</H1>
            </YStack>

            <Card p="$4" bg="$color2">
              <YStack gap="$3">
                <H3>基本情報</H3>
                <Separator />
                
                <YStack gap="$2">
                  <Paragraph color="$color11">所属</Paragraph>
                  <Paragraph>{profile.affiliation}</Paragraph>
                </YStack>
                
                <YStack gap="$2">
                  <Paragraph color="$color11">一言</Paragraph>
                  <Paragraph>{profile.bio}</Paragraph>
                </YStack>
              </YStack>
            </Card>

            {(profile.instagram_id || profile.twitter_id) && (
              <Card p="$4" bg="$color2">
                <YStack gap="$3">
                  <H3>ソーシャルメディア</H3>
                  <Separator />
                  
                  <YStack gap="$3">
                    {profile.instagram_id && (
                      <XStack items="center" gap="$2">
                        <Instagram size="$1" color="$pink10" />
                        <Paragraph>@{profile.instagram_id}</Paragraph>
                      </XStack>
                    )}
                    
                    {profile.twitter_id && (
                      <XStack items="center" gap="$2">
                        <Twitter size="$1" color="$blue10" />
                        <Paragraph>@{profile.twitter_id}</Paragraph>
                      </XStack>
                    )}
                  </YStack>
                </YStack>
              </Card>
            )}

            <Card p="$4" bg="$color2">
              <YStack gap="$2">
                <Paragraph color="$color11">作成日</Paragraph>
                <Paragraph>
                  {new Date(profile.created_at).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Paragraph>
              </YStack>
            </Card>

            <Button onPress={() => onOpenChange(false)} size="$5">
              閉じる
            </Button>
          </YStack>
        ) : (
          <YStack flex={1} justify="center" items="center">
            <Paragraph>プロフィールを選択してください</Paragraph>
          </YStack>
        )}
      </Sheet.Frame>
    </Sheet>
  )
}